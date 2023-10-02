import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
    Permission,
    QuerySearchArgs,
    SearchInput,
    SearchResponse,
} from '@ericpereiraglobalsys/common/lib/generated-types';
import { Omit } from '@ericpereiraglobalsys/common/lib/omit';

import { RequestContext } from '../../../api/common/request-context';
import { Allow } from '../../../api/decorators/allow.decorator';
import { Ctx } from '../../../api/decorators/request-context.decorator';
import { SearchResolver as BaseSearchResolver } from '../../../api/resolvers/admin/search.resolver';
import { InternalServerError } from '../../../common/error/errors';
import { FulltextSearchService } from '../fulltext-search.service';
import { SearchJobBufferService } from '../search-job-buffer/search-job-buffer.service';

@Resolver('SearchResponse')
export class ShopFulltextSearchResolver
    implements Pick<BaseSearchResolver, 'search'>
{
    constructor(private fulltextSearchService: FulltextSearchService) {}

    @Query()
    @Allow(Permission.Public)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'collections'>> {
        const result = await this.fulltextSearchService.search(ctx, args.input, true);
        // ensure the facetValues property resolver has access to the input args
        (result as any).input = args.input;
        return result;
    }
}

@Resolver('SearchResponse')
export class AdminFulltextSearchResolver implements BaseSearchResolver {
    constructor(
        private fulltextSearchService: FulltextSearchService,
        private searchJobBufferService: SearchJobBufferService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'collections'>> {
        const result = await this.fulltextSearchService.search(ctx, args.input, false);
        // ensure the facetValues property resolver has access to the input args
        (result as any).input = args.input;
        return result;
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async reindex(@Ctx() ctx: RequestContext) {
        return this.fulltextSearchService.reindex(ctx);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async pendingSearchIndexUpdates(...args: any[]): Promise<any> {
        return this.searchJobBufferService.getPendingSearchUpdates();
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async runPendingSearchIndexUpdates(...args: any[]): Promise<any> {
        // Intentionally not awaiting this method call
        void this.searchJobBufferService.runPendingSearchUpdates();
        return { success: true };
    }
}
