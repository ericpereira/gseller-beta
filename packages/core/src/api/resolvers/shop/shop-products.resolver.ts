import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    QueryCollectionArgs,
    QueryCollectionsArgs,
    QueryFacetArgs,
    QueryFacetsArgs,
    QueryProductArgs,
    QueryProductsArgs,
    SearchResponse,
} from '@vendure/common/lib/generated-shop-types';
import { Omit } from '@vendure/common/lib/omit';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { InternalServerError, UserInputError } from '../../../common/error/errors';
import { ListQueryOptions } from '../../../common/types/common-types';
import { Translated } from '../../../common/types/locale-types';
import { Product } from '../../../entity/product/product.entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ProductService } from '../../../service/services/product.service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class ShopProductsResolver {
    constructor(
        private productService: ProductService,
    ) {}

    @Query()
    async products(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductsArgs,
        @Relations({ entity: Product, omit: ['variants', 'assets'] }) relations: RelationPaths<Product>,
    ): Promise<PaginatedList<Translated<Product>>> {
        const options: ListQueryOptions<Product> = {
            ...args.options,
            filter: {
                ...(args.options && args.options.filter),
                enabled: { eq: true },
            },
        };
        return this.productService.findAll(ctx, options, relations);
    }

    @Query()
    async product(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryProductArgs,
        @Relations({ entity: Product, omit: ['variants', 'assets'] }) relations: RelationPaths<Product>,
    ): Promise<Translated<Product> | undefined> {
        let result: Translated<Product> | undefined;
        if (args.id) {
            result = await this.productService.findOne(ctx, args.id, relations);
        } else if (args.slug) {
            result = await this.productService.findOneBySlug(ctx, args.slug, relations);
        } else {
            throw new UserInputError('error.product-id-or-slug-must-be-provided');
        }
        if (!result) {
            return;
        }
        if (result.enabled === false) {
            return;
        }
        return result;
    }

    @Query()
    async search(...args: any): Promise<Omit<SearchResponse, 'facetValues'>> {
        throw new InternalServerError('error.no-search-plugin-configured');
    }
}
