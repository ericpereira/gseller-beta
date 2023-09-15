import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import {
    CurrencyCode,
    ProductVariantPrice,
    StockMovementListOptions,
} from '@vendure/common/lib/generated-types';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { Translated } from '../../../common/types/locale-types';
import { idsAreEqual } from '../../../common/utils';
import { Asset, Channel, Product, ProductOption } from '../../../entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { AssetService } from '../../../service/services/asset.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ProductVariant')
export class ProductVariantEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private assetService: AssetService,
        private localeStringHydrator: LocaleStringHydrator,
        private requestContextCache: RequestContextCacheService,
    ) {}

    @ResolveField()
    async name(@Ctx() ctx: RequestContext, @Parent() productVariant: ProductVariant): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, productVariant, 'name');
    }

    @ResolveField()
    async languageCode(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, productVariant, 'languageCode');
    }

    @ResolveField()
    async price(@Ctx() ctx: RequestContext, @Parent() productVariant: ProductVariant): Promise<number> {
        return this.productVariantService.hydratePriceFields(ctx, productVariant, 'price');
    }

    @ResolveField()
    async currencyCode(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<CurrencyCode> {
        return this.productVariantService.hydratePriceFields(ctx, productVariant, 'currencyCode');
    }

    @ResolveField()
    async product(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Product | undefined> {
        if (productVariant.product) {
            return productVariant.product;
        }
        return this.requestContextCache.get(
            ctx,
            `ProductVariantEntityResolver.product(${productVariant.productId})`,
            () => this.productVariantService.getProductForVariant(ctx, productVariant),
        );
    }

    @ResolveField()
    async assets(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Asset[] | undefined> {
        return this.assetService.getEntityAssets(ctx, productVariant);
    }

    @ResolveField()
    async featuredAsset(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Asset | undefined> {
        if (productVariant.featuredAsset) {
            return productVariant.featuredAsset;
        }
        return this.assetService.getFeaturedAsset(ctx, productVariant);
    }

    @ResolveField()
    async options(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Array<Translated<ProductOption>>> {
        if (productVariant.options) {
            return productVariant.options as Array<Translated<ProductOption>>;
        }
        return this.productVariantService.getOptionsForVariant(ctx, productVariant.id);
    }
}

@Resolver('ProductVariant')
export class ProductVariantAdminEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
    ) {}

    @ResolveField()
    async channels(@Ctx() ctx: RequestContext, @Parent() productVariant: ProductVariant): Promise<Channel[]> {
        const isDefaultChannel = ctx.channel.code === DEFAULT_CHANNEL_CODE;
        const channels = await this.productVariantService.getProductVariantChannels(ctx, productVariant.id);
        return channels.filter(channel => (isDefaultChannel ? true : idsAreEqual(channel.id, ctx.channelId)));
    }

    @ResolveField()
    async prices(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<ProductVariantPrice[]> {
        if (productVariant.productVariantPrices) {
            return productVariant.productVariantPrices.filter(pvp =>
                idsAreEqual(pvp.channelId, ctx.channelId),
            );
        }
        return this.productVariantService.getProductVariantPrices(ctx, productVariant.id);
    }
}
