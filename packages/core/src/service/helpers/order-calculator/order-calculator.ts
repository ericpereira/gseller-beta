import { Injectable } from '@nestjs/common';
import { filterAsync } from '@vendure/common/lib/filter-async';
import { AdjustmentType } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { InternalServerError } from '../../../common/error/errors';
import { idsAreEqual } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { OrderLine } from '../../../entity';
import { Order } from '../../../entity/order/order.entity';
import { Zone } from '../../../entity/zone/zone.entity';
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
        private requestContextCache: RequestContextCacheService,
    ) {}

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
        
        order.subTotal = totalPrice;
        order.subTotalWithTax = totalPriceWithTax;

        let shippingPrice = 0;
        let shippingPriceWithTax = 0;
        order.shipping = shippingPrice;
        order.shippingWithTax = shippingPriceWithTax;
    }
}
