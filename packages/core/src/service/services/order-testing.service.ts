import { Injectable } from '@nestjs/common';
import {
    CreateAddressInput,
    ShippingMethodQuote,
    TestEligibleShippingMethodsInput,
    TestShippingMethodInput,
    TestShippingMethodQuote,
    TestShippingMethodResult,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Order } from '../../entity/order/order.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { ProductPriceApplicator } from '../helpers/product-price-applicator/product-price-applicator';
import { TranslatorService } from '../helpers/translator/translator.service';

/**
 * @description
 * This service is responsible for creating temporary mock Orders against which tests can be run, such as
 * testing a ShippingMethod or Promotion.
 *
 * @docsCategory services
 */
@Injectable()
export class OrderTestingService {
    constructor(
        private connection: TransactionalConnection,
        private orderCalculator: OrderCalculator,
        private configArgService: ConfigArgService,
        private configService: ConfigService,
        private productPriceApplicator: ProductPriceApplicator,
        private translator: TranslatorService,
    ) {}

    private async buildMockOrder(
        ctx: RequestContext,
        shippingAddress: CreateAddressInput,
        lines: Array<{ productVariantId: ID; quantity: number }>,
    ): Promise<Order> {
        const { orderItemPriceCalculationStrategy } = this.configService.orderOptions;
        const mockOrder = new Order({
            lines: [],
            surcharges: [],
            modifications: [],
        });
        mockOrder.shippingAddress = shippingAddress;
        for (const line of lines) {
            const productVariant = await this.connection.getEntityOrThrow(
                ctx,
                ProductVariant,
                line.productVariantId,
                { relations: ['taxCategory'] },
            );
            await this.productPriceApplicator.applyChannelPriceAndTax(productVariant, ctx, mockOrder);
            const orderLine = new OrderLine({
                productVariant,
                adjustments: [],
                taxLines: [],
                quantity: line.quantity,
                taxCategory: productVariant.taxCategory,
            });
            mockOrder.lines.push(orderLine);

            const { price, priceIncludesTax } = await orderItemPriceCalculationStrategy.calculateUnitPrice(
                ctx,
                productVariant,
                orderLine.customFields || {},
                mockOrder,
                orderLine.quantity,
            );
            const taxRate = productVariant.taxRateApplied;
            orderLine.listPrice = price;
            orderLine.listPriceIncludesTax = priceIncludesTax;
        }
        await this.orderCalculator.applyPriceAdjustments(ctx, mockOrder, []);
        return mockOrder;
    }
}
