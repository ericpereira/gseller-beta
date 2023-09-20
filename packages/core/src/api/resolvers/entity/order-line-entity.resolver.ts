import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Asset, Order, OrderLine } from '../../../entity';
import { AssetService, OrderService } from '../../../service';
import { RequestContext } from '../../common/request-context';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('OrderLine')
export class OrderLineEntityResolver {
    constructor(
        private assetService: AssetService,
        private orderService: OrderService,
    ) {}

    @ResolveField()
    async featuredAsset(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
    ): Promise<Asset | undefined> {
        if (orderLine.featuredAsset) {
            return orderLine.featuredAsset;
        } else {
            return this.assetService.getFeaturedAsset(ctx, orderLine);
        }
    }

    @ResolveField()
    async order(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
        @Relations(Order) relations: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        return this.orderService.findOneByOrderLineId(ctx, orderLine.id, relations);
    }
}
