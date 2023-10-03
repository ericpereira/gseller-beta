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
export class AdminFulltextSearchResolver implements BaseSearchResolver {
    constructor(
        private fulltextSearchService: FulltextSearchService,
        private searchJobBufferService: SearchJobBufferService,
    ) {}
}
