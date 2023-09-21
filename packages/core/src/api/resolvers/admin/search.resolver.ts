import { Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Permission, SearchResponse } from '@gseller/common/lib/generated-types';
import { Omit } from '@gseller/common/lib/omit';

import { InternalServerError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { Allow } from '../../decorators/allow.decorator';

@Resolver()
export class SearchResolver {
    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async search(...args: any): Promise<Omit<SearchResponse, 'collections'>> {
        throw new InternalServerError('error.no-search-plugin-configured');
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async reindex(...args: any[]): Promise<any> {
        throw new InternalServerError('error.no-search-plugin-configured');
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async pendingSearchIndexUpdates(...args: any[]): Promise<any> {
        throw new InternalServerError('error.no-search-plugin-configured');
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async runPendingSearchIndexUpdates(...args: any[]): Promise<any> {
        throw new InternalServerError('error.no-search-plugin-configured');
    }
}
