import { Injectable } from '@nestjs/common';
import { filterAsync } from '@vendure/common/lib/filter-async';
import { AdjustmentType } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { InternalServerError } from '../../../common/error/errors';
import { idsAreEqual } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { OrderLine, TaxCategory, TaxRate } from '../../../entity';
import { Order } from '../../../entity/order/order.entity';
import { Zone } from '../../../entity/zone/zone.entity';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';

import { prorate } from './prorate';

/**
 * @description
 * This helper is used when making changes to an Order, to apply all applicable price adjustments to that Order,
 * including:
 *
 * - Promotions
 * - Taxes
 * - Shipping
 *
 * @docsCategory service-helpers
 */
@Injectable()
export class OrderCalculator {
    constructor(
        private configService: ConfigService,
        private zoneService: ZoneService,
        private taxRateService: TaxRateService,
        private requestContextCache: RequestContextCacheService,
    ) {}

    /**
     * @description
     * Applies taxes and promotions to an Order. Mutates the order object.
     * Returns an array of any OrderItems which had new adjustments
     * applied, either tax or promotions.
     */
    async applyPriceAdjustments(
        ctx: RequestContext,
        order: Order,
        updatedOrderLines: OrderLine[] = [],
        options?: { recalculateShipping?: boolean },
    ): Promise<Order> {
        const { taxZoneStrategy } = this.configService.taxOptions;
        const zones = await this.zoneService.getAllWithMembers(ctx);
        const activeTaxZone = await this.requestContextCache.get(ctx, 'activeTaxZone', () =>
            taxZoneStrategy.determineTaxZone(ctx, zones, ctx.channel, order),
        );

        let taxZoneChanged = false;
        if (!activeTaxZone) {
            throw new InternalServerError('error.no-active-tax-zone');
        }
        if (!order.taxZoneId || !idsAreEqual(order.taxZoneId, activeTaxZone.id)) {
            order.taxZoneId = activeTaxZone.id;
            taxZoneChanged = true;
        }
        for (const updatedOrderLine of updatedOrderLines) {
            await this.applyTaxesToOrderLine(
                ctx,
                order,
                updatedOrderLine,
                activeTaxZone,
                this.createTaxRateGetter(ctx, activeTaxZone),
            );
        }
        this.calculateOrderTotals(order);
        if (order.lines.length) {
            if (taxZoneChanged) {
                // First apply taxes to the non-discounted prices
                await this.applyTaxes(ctx, order, activeTaxZone);
            }

            // Then test and apply promotions
            const totalBeforePromotions = order.subTotal;

            if (order.subTotal !== totalBeforePromotions) {
                // Finally, re-calculate taxes because the promotions may have
                // altered the unit prices, which in turn will alter the tax payable.
                await this.applyTaxes(ctx, order, activeTaxZone);
            }
        }
        this.calculateOrderTotals(order);
        return order;
    }

    /**
     * @description
     * Applies the correct TaxRate to each OrderLine in the order.
     */
    private async applyTaxes(ctx: RequestContext, order: Order, activeZone: Zone) {
        const getTaxRate = this.createTaxRateGetter(ctx, activeZone);
        for (const line of order.lines) {
            await this.applyTaxesToOrderLine(ctx, order, line, activeZone, getTaxRate);
        }
        this.calculateOrderTotals(order);
    }

    /**
     * @description
     * Applies the correct TaxRate to an OrderLine
     */
    private async applyTaxesToOrderLine(
        ctx: RequestContext,
        order: Order,
        line: OrderLine,
        activeZone: Zone,
        getTaxRate: (taxCategory: TaxCategory) => Promise<TaxRate>,
    ) {
        const applicableTaxRate = await getTaxRate(line.taxCategory);
        const { taxLineCalculationStrategy } = this.configService.taxOptions;
        line.taxLines = await taxLineCalculationStrategy.calculate({
            ctx,
            applicableTaxRate,
            order,
            orderLine: line,
        });
    }

    /**
     * @description
     * Returns a memoized function for performing an efficient
     * lookup of the correct TaxRate for a given TaxCategory.
     */
    private createTaxRateGetter(
        ctx: RequestContext,
        activeZone: Zone,
    ): (taxCategory: TaxCategory) => Promise<TaxRate> {
        const taxRateCache = new Map<TaxCategory, TaxRate>();

        return async (taxCategory: TaxCategory): Promise<TaxRate> => {
            const cached = taxRateCache.get(taxCategory);
            if (cached) {
                return cached;
            }
            const rate = await this.taxRateService.getApplicableTaxRate(ctx, activeZone, taxCategory);
            taxRateCache.set(taxCategory, rate);
            return rate;
        };
    }

    /**
     * @description
     * Sets the totals properties on an Order by summing each OrderLine, and taking
     * into account any Surcharges and ShippingLines. Does not save the Order, so
     * the entity must be persisted to the DB after calling this method.
     *
     * Note that this method does *not* evaluate any taxes or promotions. It assumes
     * that has already been done and is solely responsible for summing the
     * totals.
     */
    public calculateOrderTotals(order: Order) {
        let totalPrice = 0;
        let totalPriceWithTax = 0;

        for (const line of order.lines) {
            totalPrice += line.proratedLinePrice;
            totalPriceWithTax += line.proratedLinePriceWithTax;
        }
        for (const surcharge of order.surcharges) {
            totalPrice += surcharge.price;
            totalPriceWithTax += surcharge.priceWithTax;
        }

        order.subTotal = totalPrice;
        order.subTotalWithTax = totalPriceWithTax;

        let shippingPrice = 0;
        let shippingPriceWithTax = 0;
        order.shipping = shippingPrice;
        order.shippingWithTax = shippingPriceWithTax;
    }
}
