import { Injectable } from '@nestjs/common';
import {
    AddPaymentToOrderResult,
    ApplyCouponCodeResult,
    PaymentInput,
    PaymentMethodQuote,
    RemoveOrderItemsResult,
    SetOrderShippingMethodResult,
    UpdateOrderItemsResult,
} from '@vendure/common/lib/generated-shop-types';
import {
    AddFulfillmentToOrderResult,
    AddManualPaymentToOrderResult,
    AddNoteToOrderInput,
    AdjustmentType,
    CancelOrderInput,
    CancelOrderResult,
    CancelPaymentResult,
    CreateAddressInput,
    DeletionResponse,
    DeletionResult,
    FulfillOrderInput,
    HistoryEntryType,
    ManualPaymentInput,
    ModifyOrderInput,
    ModifyOrderResult,
    OrderLineInput,
    OrderListOptions,
    OrderProcessState,
    OrderType,
    RefundOrderInput,
    RefundOrderResult,
    SettlePaymentResult,
    SettleRefundInput,
    ShippingMethodQuote,
    TransitionPaymentToStateResult,
    UpdateOrderNoteInput,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { In, IsNull } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { RequestContextCacheService } from '../../cache/request-context-cache.service';
import { ErrorResultUnion, isGraphQlErrorResult } from '../../common/error/error-result';
import { EntityNotFoundError, InternalServerError, UserInputError } from '../../common/error/errors';
import {
    CancelPaymentError,
    EmptyOrderLineSelectionError,
    FulfillmentStateTransitionError,
    InsufficientStockOnHandError,
    ItemsAlreadyFulfilledError,
    ManualPaymentStateError,
    MultipleOrderError,
    NothingToRefundError,
    PaymentOrderMismatchError,
    RefundOrderStateError,
    SettlePaymentError,
} from '../../common/error/generated-graphql-admin-errors';
import {
    IneligibleShippingMethodError,
    InsufficientStockError,
    NegativeQuantityError,
    OrderLimitError,
    OrderModificationError,
    OrderPaymentStateError,
    OrderStateTransitionError,
    PaymentDeclinedError,
    PaymentFailedError,
} from '../../common/error/generated-graphql-shop-errors';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Channel } from '../../entity/channel/channel.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { Order } from '../../entity/order/order.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { OrderModification } from '../../entity/order-modification/order-modification.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import {
    CouponCodeEvent,
    OrderEvent,
    OrderLineEvent,
    OrderStateTransitionEvent,
} from '../../event-bus/index';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { OrderMerger } from '../helpers/order-merger/order-merger';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { OrderStateMachine } from '../helpers/order-state-machine/order-state-machine';
import { TranslatorService } from '../helpers/translator/translator.service';
import { getOrdersFromLines, totalCoveredByPayments } from '../helpers/utils/order-utils';
import { patchEntity } from '../helpers/utils/patch-entity';

import { ChannelService } from './channel.service';
import { CountryService } from './country.service';
import { CustomerService } from './customer.service';

/**
 * @description
 * Contains methods relating to {@link Order} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class OrderService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private customerService: CustomerService,
        private countryService: CountryService,
        private orderCalculator: OrderCalculator,
        private orderStateMachine: OrderStateMachine,
        private orderMerger: OrderMerger,
        private listQueryBuilder: ListQueryBuilder,
        private eventBus: EventBus,
        private channelService: ChannelService,
        private customFieldRelationService: CustomFieldRelationService,
        private requestCache: RequestContextCacheService,
        private translator: TranslatorService,
    ) {}

    /**
     * @description
     * Returns an array of all the configured states and transitions of the order process. This is
     * based on the default order process plus all configured {@link OrderProcess} objects
     * defined in the {@link OrderOptions} `process` array.
     */
    getOrderProcessStates(): OrderProcessState[] {
        return Object.entries(this.orderStateMachine.config.transitions).map(([name, { to }]) => ({
            name,
            to,
        })) as OrderProcessState[];
    }

    findAll(
        ctx: RequestContext,
        options?: OrderListOptions,
        relations?: RelationPaths<Order>,
    ): Promise<PaginatedList<Order>> {
        return this.listQueryBuilder
            .build(Order, options, {
                ctx,
                relations: relations ?? [
                    'lines',
                    'customer',
                    'lines.productVariant',
                    'channels',
                    'shippingLines',
                    'payments',
                ],
                channelId: ctx.channelId,
                customPropertyMap: {
                    customerLastName: 'customer.lastName',
                    transactionId: 'payments.transactionId',
                },
            })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(
        ctx: RequestContext,
        orderId: ID,
        relations?: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        const qb = this.connection.getRepository(ctx, Order).createQueryBuilder('order');
        const effectiveRelations = relations ?? [
            'channels',
            'customer',
            'customer.user',
            'lines',
            'lines.productVariant',
            'lines.productVariant.taxCategory',
            'lines.productVariant.productVariantPrices',
            'lines.productVariant.translations',
            'lines.featuredAsset',
            'lines.taxCategory',
            'shippingLines',
            'surcharges',
        ];
        if (
            relations &&
            !effectiveRelations.includes('lines.productVariant.taxCategory')
        ) {
            effectiveRelations.push('lines.productVariant.taxCategory');
        }
        qb.setFindOptions({ relations: effectiveRelations })
            .leftJoin('order.channels', 'channel')
            .where('order.id = :orderId', { orderId })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId });
        if (effectiveRelations.includes('lines')) {
            qb.addOrderBy(`order__order_lines.${qb.escape('createdAt')}`, 'ASC').addOrderBy(
                `order__order_lines.${qb.escape('productVariantId')}`,
                'ASC',
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        const order = await qb.getOne();
        if (order) {
            return order;
        }
    }

    async findOneByCode(
        ctx: RequestContext,
        orderCode: string,
        relations?: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        const order = await this.connection.getRepository(ctx, Order).findOne({
            relations: ['customer'],
            where: {
                code: orderCode,
            },
        });
        return order ? this.findOne(ctx, order.id, relations) : undefined;
    }

    async findOneByOrderLineId(
        ctx: RequestContext,
        orderLineId: ID,
        relations?: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        const order = await this.connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .innerJoin('order.lines', 'line', 'line.id = :orderLineId', { orderLineId })
            .getOne();

        return order ? this.findOne(ctx, order.id, relations) : undefined;
    }

    async findByCustomerId(
        ctx: RequestContext,
        customerId: ID,
        options?: ListQueryOptions<Order>,
        relations?: RelationPaths<Order>,
    ): Promise<PaginatedList<Order>> {
        const effectiveRelations = (relations ?? ['lines', 'customer', 'channels']).filter(
            r =>
                // Don't join productVariant because it messes with the
                // price calculation in certain edge-case field resolver scenarios
                !r.includes('productVariant'),
        );
        return this.listQueryBuilder
            .build(Order, options, {
                relations: relations ?? ['lines', 'customer', 'channels', 'shippingLines'],
                channelId: ctx.channelId,
                ctx,
            })
            .andWhere('order.state != :draftState', { draftState: 'Draft' })
            .andWhere('order.customer.id = :customerId', { customerId })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }

    /**
     * @description
     * Returns an array of any {@link OrderModification} entities associated with the Order.
     */
    getOrderModifications(ctx: RequestContext, orderId: ID): Promise<OrderModification[]> {
        return this.connection.getRepository(ctx, OrderModification).find({
            where: {
                order: { id: orderId },
            },
            relations: ['lines', 'payment', 'refund', 'surcharges'],
        });
    }

    getSellerOrders(ctx: RequestContext, order: Order): Promise<Order[]> {
        return this.connection.getRepository(ctx, Order).find({
            where: {
                aggregateOrderId: order.id,
            },
            relations: ['channels'],
        });
    }

    async getAggregateOrder(ctx: RequestContext, order: Order): Promise<Order | undefined> {
        return order.aggregateOrderId == null
            ? undefined
            : this.connection
                  .getRepository(ctx, Order)
                  .findOne({ where: { id: order.aggregateOrderId }, relations: ['channels', 'lines'] })
                  .then(result => result ?? undefined);
    }

    getOrderChannels(ctx: RequestContext, order: Order): Promise<Channel[]> {
        return this.connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .relation('channels')
            .of(order)
            .loadMany();
    }

    /**
     * @description
     * Returns any Order associated with the specified User's Customer account
     * that is still in the `active` state.
     */
    async getActiveOrderForUser(ctx: RequestContext, userId: ID): Promise<Order | undefined> {
        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (customer) {
            const activeOrder = await this.connection
                .getRepository(ctx, Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.channels', 'channel', 'channel.id = :channelId', {
                    channelId: ctx.channelId,
                })
                .leftJoinAndSelect('order.customer', 'customer')
                .leftJoinAndSelect('order.shippingLines', 'shippingLines')
                .where('order.active = :active', { active: true })
                .andWhere('order.customer.id = :customerId', { customerId: customer.id })
                .orderBy('order.createdAt', 'DESC')
                .getOne();
            if (activeOrder) {
                return this.findOne(ctx, activeOrder.id);
            }
        }
    }

    /**
     * @description
     * Creates a new, empty Order. If a `userId` is passed, the Order will get associated with that
     * User's Customer account.
     */
    async create(ctx: RequestContext, userId?: ID): Promise<Order> {
        const newOrder = await this.createEmptyOrderEntity(ctx);
        if (userId) {
            const customer = await this.customerService.findOneByUserId(ctx, userId);
            if (customer) {
                newOrder.customer = customer;
            }
        }
        await this.channelService.assignToCurrentChannel(newOrder, ctx);
        const order = await this.connection.getRepository(ctx, Order).save(newOrder);
        this.eventBus.publish(new OrderEvent(ctx, order, 'created'));
        const transitionResult = await this.transitionToState(ctx, order.id, 'AddingItems');
        if (isGraphQlErrorResult(transitionResult)) {
            // this should never occur, so we will throw rather than return
            throw transitionResult;
        }
        return transitionResult;
    }

    async createDraft(ctx: RequestContext) {
        const newOrder = await this.createEmptyOrderEntity(ctx);
        newOrder.active = false;
        await this.channelService.assignToCurrentChannel(newOrder, ctx);
        const order = await this.connection.getRepository(ctx, Order).save(newOrder);
        this.eventBus.publish(new OrderEvent(ctx, order, 'created'));
        const transitionResult = await this.transitionToState(ctx, order.id, 'Draft');
        if (isGraphQlErrorResult(transitionResult)) {
            // this should never occur, so we will throw rather than return
            throw transitionResult;
        }
        return transitionResult;
    }

    private async createEmptyOrderEntity(ctx: RequestContext) {
        return new Order({
            type: OrderType.Regular,
            code: await this.configService.orderOptions.orderCodeStrategy.generate(ctx),
            state: this.orderStateMachine.getInitialState(),
            lines: [],
            couponCodes: [],
            modifications: [],
            shippingAddress: {},
            billingAddress: {},
            subTotal: 0,
            subTotalWithTax: 0,
            currencyCode: ctx.currencyCode,
        });
    }

    /**
     * @description
     * Updates the custom fields of an Order.
     */
    async updateCustomFields(ctx: RequestContext, orderId: ID, customFields: any) {
        let order = await this.getOrderOrThrow(ctx, orderId);
        order = patchEntity(order, { customFields });
        await this.customFieldRelationService.updateRelations(ctx, Order, { customFields }, order);
        const updatedOrder = await this.connection.getRepository(ctx, Order).save(order);
        this.eventBus.publish(new OrderEvent(ctx, updatedOrder, 'updated'));
        return updatedOrder;
    }


    /**
     * @description
     * Removes the specified OrderLine from the Order.
     */
    async removeItemFromOrder(
        ctx: RequestContext,
        orderId: ID,
        orderLineId: ID,
    ): Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const validationError = this.assertAddingItemsState(order);
        if (validationError) {
            return validationError;
        }
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        order.lines = order.lines.filter(line => !idsAreEqual(line.id, orderLineId));
        const updatedOrder = await this.applyPriceAdjustments(ctx, order);
        await this.connection.getRepository(ctx, OrderLine).remove(orderLine);
        this.eventBus.publish(new OrderLineEvent(ctx, order, orderLine, 'deleted'));
        return updatedOrder;
    }

    /**
     * @description
     * Removes all OrderLines from the Order.
     */
    async removeAllItemsFromOrder(
        ctx: RequestContext,
        orderId: ID,
    ): Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const validationError = this.assertAddingItemsState(order);
        if (validationError) {
            return validationError;
        }
        await this.connection.getRepository(ctx, OrderLine).remove(order.lines);
        order.lines = [];
        const updatedOrder = await this.applyPriceAdjustments(ctx, order);
        return updatedOrder;
    }

    /**
     * @description
     * Removes a coupon code from the Order.
     */
    async removeCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.couponCodes.includes(couponCode)) {
            // When removing a couponCode which has triggered an Order-level discount
            // we need to make sure we persist the changes to the adjustments array of
            // any affected OrderLines.
            const affectedOrderLines = order.lines.filter(
                line =>
                    line.adjustments.filter(a => a.type === AdjustmentType.DISTRIBUTED_ORDER_PROMOTION)
                        .length,
            );
            order.couponCodes = order.couponCodes.filter(cc => cc !== couponCode);
            
            this.eventBus.publish(new CouponCodeEvent(ctx, couponCode, orderId, 'removed'));
            const result = await this.applyPriceAdjustments(ctx, order);
            await this.connection.getRepository(ctx, OrderLine).save(affectedOrderLines);
            return result;
        } else {
            return order;
        }
    }

    /**
     * @description
     * Returns the next possible states that the Order may transition to.
     */
    getNextOrderStates(order: Order): readonly OrderState[] {
        return this.orderStateMachine.getNextStates(order);
    }

    /**
     * @description
     * Sets the shipping address for the Order.
     */
    async setShippingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        const shippingAddress = { ...input, countryCode: input.countryCode, country: country.name };
        await this.connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .update(Order)
            .set({ shippingAddress })
            .where('id = :id', { id: order.id })
            .execute();
        order.shippingAddress = shippingAddress;
        // Since a changed ShippingAddress could alter the activeTaxZone,
        // we will remove any cached activeTaxZone, so it can be re-calculated
        // as needed.
        this.requestCache.set(ctx, 'activeTaxZone', undefined);
        return this.applyPriceAdjustments(ctx, order, order.lines);
    }

    /**
     * @description
     * Sets the billing address for the Order.
     */
    async setBillingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        const billingAddress = { ...input, countryCode: input.countryCode, country: country.name };
        await this.connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .update(Order)
            .set({ billingAddress })
            .where('id = :id', { id: order.id })
            .execute();
        order.billingAddress = billingAddress;
        // Since a changed BillingAddress could alter the activeTaxZone,
        // we will remove any cached activeTaxZone, so it can be re-calculated
        // as needed.
        this.requestCache.set(ctx, 'activeTaxZone', undefined);
        return this.applyPriceAdjustments(ctx, order, order.lines);
    }

    /**
     * @description
     * Transitions the Order to the given state.
     */
    async transitionToState(
        ctx: RequestContext,
        orderId: ID,
        state: OrderState,
    ): Promise<Order | OrderStateTransitionError> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const fromState = order.state;
        let finalize: () => Promise<any>;
        try {
            const result = await this.orderStateMachine.transition(ctx, order, state);
            finalize = result.finalize;
        } catch (e: any) {
            const transitionError = ctx.translate(e.message, { fromState, toState: state });
            return new OrderStateTransitionError({ transitionError, fromState, toState: state });
        }
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        this.eventBus.publish(new OrderStateTransitionEvent(fromState, state, ctx, order));
        await finalize();
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        return order;
    }

    /**
     * @description
     * We can add a Payment to the order if:
     * 1. the Order is in the `ArrangingPayment` state or
     * 2. the Order's current state can transition to `PaymentAuthorized` and `PaymentSettled`
     */
    private canAddPaymentToOrder(order: Order): boolean {
        if (order.state === 'ArrangingPayment') {
            return true;
        }
        const canTransitionToPaymentAuthorized = this.orderStateMachine.canTransition(
            order.state,
            'PaymentAuthorized',
        );
        const canTransitionToPaymentSettled = this.orderStateMachine.canTransition(
            order.state,
            'PaymentSettled',
        );
        return canTransitionToPaymentAuthorized && canTransitionToPaymentSettled;
    }

    /**
     * @description
     * Cancels an Order by transitioning it to the `Cancelled` state. If stock is being tracked for the ProductVariants
     * in the Order, then new {@link StockMovement}s will be created to correct the stock levels.
     */
    async cancelOrder(
        ctx: RequestContext,
        input: CancelOrderInput,
    ): Promise<ErrorResultUnion<CancelOrderResult, Order>> {
        let allOrderItemsCancelled = false;
        const cancelResult =
            input.lines != await this.cancelOrderById(ctx, input);

        if (isGraphQlErrorResult(cancelResult)) {
            return cancelResult;
        } else {
            allOrderItemsCancelled = cancelResult;
        }

        if (allOrderItemsCancelled) {
            const transitionResult = await this.transitionToState(ctx, input.orderId, 'Cancelled');
            if (isGraphQlErrorResult(transitionResult)) {
                return transitionResult;
            }
        }
        return assertFound(this.findOne(ctx, input.orderId));
    }

    private async cancelOrderById(ctx: RequestContext, input: CancelOrderInput) {
        const order = await this.getOrderOrThrow(ctx, input.orderId);
        if (order.active) {
            return true;
        } else {
            const lines: OrderLineInput[] = order.lines.map(l => ({
                orderLineId: l.id,
                quantity: l.quantity,
            }));
        }
    }

    /**
     * @description
     * Associates a Customer with the Order.
     */
    async addCustomerToOrder(ctx: RequestContext, orderId: ID, customer: Customer): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        order.customer = customer;
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        // Check that any applied couponCodes are still valid now that
        // we know the Customer.
        let updatedOrder = order;
        return updatedOrder;
    }

    /**
     * @description
     * Deletes an Order, ensuring that any Sessions that reference this Order are dereferenced before deletion.
     *
     * @since 1.5.0
     */
    async deleteOrder(ctx: RequestContext, orderOrId: ID | Order) {
        const orderToDelete =
            orderOrId instanceof Order
                ? orderOrId
                : await this.connection
                      .getRepository(ctx, Order)
                      .findOneOrFail({ where: { id: orderOrId }, relations: ['lines', 'shippingLines'] });
        // If there is a Session referencing the Order to be deleted, we must first remove that
        // reference in order to avoid a foreign key error. See https://github.com/vendure-ecommerce/vendure/issues/1454
        const sessions = await this.connection
            .getRepository(ctx, Session)
            .find({ where: { activeOrderId: orderToDelete.id } });
        if (sessions.length) {
            await this.connection
                .getRepository(ctx, Session)
                .update(sessions.map(s => s.id) as string[], { activeOrder: null });
        }
        await this.connection.getRepository(ctx, Order).delete(orderToDelete.id);
    }

    /**
     * @description
     * When a guest user with an anonymous Order signs in and has an existing Order associated with that Customer,
     * we need to reconcile the contents of the two orders.
     *
     * The logic used to do the merging is specified in the {@link OrderOptions} `mergeStrategy` config setting.
     */
    async mergeOrders(
        ctx: RequestContext,
        user: User,
        guestOrder?: Order,
        existingOrder?: Order,
    ): Promise<Order | undefined> {
        if (guestOrder && guestOrder.customer) {
            // In this case the "guest order" is actually an order of an existing Customer,
            // so we do not want to merge at all. See https://github.com/vendure-ecommerce/vendure/issues/263
            return existingOrder;
        }
        const mergeResult = this.orderMerger.merge(ctx, guestOrder, existingOrder);
        const { orderToDelete, linesToInsert, linesToDelete, linesToModify } = mergeResult;
        let { order } = mergeResult;
        if (orderToDelete) {
            await this.deleteOrder(ctx, orderToDelete);
        }
        if (order && linesToInsert) {
            const orderId = order.id;
        }
        if (order && linesToModify) {
            const orderId = order.id;
        }
        if (order && linesToDelete) {
            const orderId = order.id;
            for (const line of linesToDelete) {
                const result = await this.removeItemFromOrder(ctx, orderId, line.orderLineId);
                if (!isGraphQlErrorResult(result)) {
                    order = result;
                }
            }
        }
        const customer = await this.customerService.findOneByUserId(ctx, user.id);
        if (order && customer) {
            order.customer = customer;
            await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        }
        return order;
    }

    private async getOrderOrThrow(ctx: RequestContext, orderId: ID): Promise<Order> {
        const order = await this.findOne(ctx, orderId);
        if (!order) {
            throw new EntityNotFoundError('Order', orderId);
        }
        return order;
    }

    private getOrderLineOrThrow(order: Order, orderLineId: ID): OrderLine {
        const orderLine = order.lines.find(line => idsAreEqual(line.id, orderLineId));
        if (!orderLine) {
            throw new UserInputError('error.order-does-not-contain-line-with-id', { id: orderLineId });
        }
        return orderLine;
    }

    /**
     * Returns error if quantity is negative.
     */
    private assertQuantityIsPositive(quantity: number) {
        if (quantity < 0) {
            return new NegativeQuantityError();
        }
    }

    /**
     * Returns error if the Order is not in the "AddingItems" or "Draft" state.
     */
    private assertAddingItemsState(order: Order) {
        if (order.state !== 'AddingItems' && order.state !== 'Draft') {
            return new OrderModificationError();
        }
    }

    /**
     * Throws if adding the given quantity would take the total order items over the
     * maximum limit specified in the config.
     */
    private assertNotOverOrderItemsLimit(order: Order, quantityToAdd: number) {
        const currentItemsCount = summate(order.lines, 'quantity');
        const { orderItemsLimit } = this.configService.orderOptions;
        if (orderItemsLimit < currentItemsCount + quantityToAdd) {
            return new OrderLimitError({ maxItems: orderItemsLimit });
        }
    }

    /**
     * Throws if adding the given quantity would exceed the maximum allowed
     * quantity for one order line.
     */
    private assertNotOverOrderLineItemsLimit(orderLine: OrderLine | undefined, quantityToAdd: number) {
        const currentQuantity = orderLine?.quantity || 0;
        const { orderLineItemsLimit } = this.configService.orderOptions;
        if (orderLineItemsLimit < currentQuantity + quantityToAdd) {
            return new OrderLimitError({ maxItems: orderLineItemsLimit });
        }
    }

    /**
     * @description
     * Applies promotions, taxes and shipping to the Order. If the `updatedOrderLines` argument is passed in,
     * then all of those OrderLines will have their prices re-calculated using the configured {@link OrderItemPriceCalculationStrategy}.
     */
    async applyPriceAdjustments(
        ctx: RequestContext,
        order: Order,
        updatedOrderLines?: OrderLine[],
    ): Promise<Order> {
        return assertFound(this.findOne(ctx, order.id));
    }
}
