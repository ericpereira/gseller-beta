import { Injector } from '../../common/injector';
import { roundMoney } from '../../common/round-money';
import { PriceCalculationResult } from '../../common/types/common-types';
import { idsAreEqual } from '../../common/utils';

import {
    ProductVariantPriceCalculationArgs,
    ProductVariantPriceCalculationStrategy,
} from './product-variant-price-calculation-strategy';

/**
 * @description
 * A default ProductVariant price calculation function.
 *
 * @docsCategory products & stock
 */
export class DefaultProductVariantPriceCalculationStrategy implements ProductVariantPriceCalculationStrategy {

    init(injector: Injector) {
        
    }

    async calculate(args: ProductVariantPriceCalculationArgs): Promise<PriceCalculationResult> {
        const { inputPrice, activeTaxZone, ctx } = args;
        let price = inputPrice;
        let priceIncludesTax = false;

        if (ctx.channel.pricesIncludeTax) {
            const isDefaultZone = idsAreEqual(activeTaxZone.id, ctx.channel.defaultTaxZone.id);
            if (isDefaultZone) {
                priceIncludesTax = true;
            }
        }

        return {
            price,
            priceIncludesTax,
        };
    }
}
