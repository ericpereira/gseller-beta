import { Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Permission, SearchResponse } from '@ericpereiraglobalsys/common/lib/generated-types';
import { Omit } from '@ericpereiraglobalsys/common/lib/omit';

import { InternalServerError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { Allow } from '../../decorators/allow.decorator';

@Resolver()
export class SearchResolver {
    
}
