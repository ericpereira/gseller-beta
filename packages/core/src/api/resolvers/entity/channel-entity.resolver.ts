import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Channel } from '../../../entity/channel/channel.entity';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Channel')
export class ChannelEntityResolver {
    constructor() {}

    @ResolveField()
    currencyCode(@Ctx() ctx: RequestContext, @Parent() channel: Channel): string {
        return channel.defaultCurrencyCode;
    }
}
