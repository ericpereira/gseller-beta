import { CONNECTED_PAYMENT_METHOD_CODE, MULTIVENDOR_PLUGIN_OPTIONS } from '../constants';
import {
  ChannelService,
  EntityHydrator,
  ID,
  Injector,
  InternalServerError,
  Order,
  OrderLine,
  OrderSellerStrategy,
  OrderService,
  PaymentMethod,
  PaymentMethodService,
  PaymentService,
  RequestContext,
  SplitOrderContents,
  Surcharge,
  TransactionalConnection,
  idsAreEqual,
  isGraphQlErrorResult,
} from '@ericpereiraglobalsys/core';

import { CustomSellerFields } from '@ericpereiraglobalsys/core/dist/entity/custom-entity-fields';
import { MultivendorPluginOptions } from '../types';

export class MultivendorSellerStrategy implements OrderSellerStrategy {
  private entityHydrator: EntityHydrator;
  private channelService: ChannelService;
  private paymentService: PaymentService;
  private paymentMethodService: PaymentMethodService;
  private connection: TransactionalConnection;
  private orderService: OrderService;
  private options: MultivendorPluginOptions;

  init(injector: Injector) {
    this.entityHydrator = injector.get(EntityHydrator);
    this.channelService = injector.get(ChannelService);
    this.paymentService = injector.get(PaymentService);
    this.paymentMethodService = injector.get(PaymentMethodService);
    this.connection = injector.get(TransactionalConnection);
    this.orderService = injector.get(OrderService);
    this.options = injector.get(MULTIVENDOR_PLUGIN_OPTIONS);
  }

  async setOrderLineSellerChannel(ctx: RequestContext, orderLine: OrderLine) {
    await this.entityHydrator.hydrate(ctx, orderLine.productVariant, { relations: ['channels'] });
    const defaultChannel = await this.channelService.getDefaultChannel();
    if (orderLine.productVariant.channels.length === 2) {
      const sellerChannel = orderLine.productVariant.channels.find((c) => !idsAreEqual(c.id, defaultChannel.id));
      if (sellerChannel) {
        return sellerChannel;
      }
    }
  }

  async splitOrder(ctx: RequestContext, order: Order): Promise<SplitOrderContents[]> {
    const partialOrders = new Map<ID, SplitOrderContents>();
    for (const line of order.lines) {
      const sellerChannelId = line.sellerChannelId;
      if (sellerChannelId) {
        let partialOrder = partialOrders.get(sellerChannelId);
        if (!partialOrder) {
          partialOrder = {
            channelId: sellerChannelId,
            shippingLines: [],
            lines: [],
            state: 'ArrangingPayment',
          };
          partialOrders.set(sellerChannelId, partialOrder);
        }
        partialOrder.lines.push(line);
      }
    }

    for (const partialOrder of partialOrders.values()) {
      const shippingLineIds = new Set(partialOrder.lines.map((l) => l.shippingLineId));
      partialOrder.shippingLines = order.shippingLines.filter((shippingLine) => shippingLineIds.has(shippingLine.id));
    }

    return [...partialOrders.values()];
  }

  async afterSellerOrdersCreated(ctx: RequestContext, aggregateOrder: Order, sellerOrders: Order[]) {
    const paymentMethod = await this.connection.rawConnection.getRepository(PaymentMethod).findOne({
      where: {
        code: CONNECTED_PAYMENT_METHOD_CODE,
      },
    });
    if (!paymentMethod) {
      return;
    }
    const defaultChannel = await this.channelService.getDefaultChannel();
    for (const sellerOrder of sellerOrders) {
      const sellerChannel = sellerOrder.channels.find((c) => !idsAreEqual(c.id, defaultChannel.id));
      if (!sellerChannel) {
        throw new InternalServerError(`Could not determine Seller Channel for Order ${sellerOrder.code}`);
      }
      sellerOrder.surcharges = [await this.createPlatformFeeSurcharge(ctx, sellerOrder)];
      await this.orderService.applyPriceAdjustments(ctx, sellerOrder);
      await this.entityHydrator.hydrate(ctx, sellerChannel, { relations: ['seller'] });

      const { connectedAccountId } = sellerChannel.seller?.customFields as CustomSellerFields;

      const result = await this.orderService.addPaymentToOrder(ctx, sellerOrder.id, {
        method: paymentMethod.code,
        metadata: {
          transfer_group: aggregateOrder.code,
          connectedAccountId,
        },
      });
      if (isGraphQlErrorResult(result)) {
        throw new InternalServerError(result.message);
      }
    }
  }

  private async createPlatformFeeSurcharge(ctx: RequestContext, sellerOrder: Order) {
    const platformFee = Math.round(sellerOrder.totalWithTax * -(this.options.platformFeePercent / 100));
    return this.connection.getRepository(ctx, Surcharge).save(
      new Surcharge({
        taxLines: [],
        sku: this.options.platformFeeSKU,
        description: 'Platform GSeller',
        listPrice: platformFee,
        listPriceIncludesTax: true,
        order: sellerOrder,
      }),
    );
  }
}
