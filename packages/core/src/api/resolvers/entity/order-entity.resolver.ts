import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { HistoryEntryListOptions, OrderHistoryArgs, SortOrder } from '@vendure/common/lib/generated-types';

import { assertFound, idsAreEqual } from '../../../common/utils';
import { Order } from '../../../entity/order/order.entity';
import { TranslatorService } from '../../../service/index';
import { OrderService } from '../../../service/services/order.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Order')
export class OrderEntityResolver {
    constructor(
        private orderService: OrderService,
    ) {}

    @ResolveField()
    async payments(@Ctx() ctx: RequestContext, @Parent() order: Order) {
        if (order.payments) {
            return order.payments;
        }
        return this.orderService.getOrderPayments(ctx, order.id);
    }

    @ResolveField()
    async lines(@Ctx() ctx: RequestContext, @Parent() order: Order) {
        if (order.lines) {
            return order.lines;
        }
        const { lines } = await assertFound(this.orderService.findOne(ctx, order.id));
        return lines;
    }
}

@Resolver('Order')
export class OrderAdminEntityResolver {
    constructor(private orderService: OrderService) {}

    @ResolveField()
    async channels(@Ctx() ctx: RequestContext, @Parent() order: Order) {
        const channels = order.channels ?? (await this.orderService.getOrderChannels(ctx, order));
        return channels.filter(channel =>
            ctx.session?.user?.channelPermissions.find(cp => idsAreEqual(cp.id, channel.id)),
        );
    }

    @ResolveField()
    async modifications(@Ctx() ctx: RequestContext, @Parent() order: Order) {
        if (order.modifications) {
            return order.modifications;
        }
        return this.orderService.getOrderModifications(ctx, order.id);
    }

    @ResolveField()
    async nextStates(@Parent() order: Order) {
        return this.orderService.getNextOrderStates(order);
    }

    @ResolveField()
    async sellerOrders(@Ctx() ctx: RequestContext, @Parent() order: Order) {
        const sellerOrders = await this.orderService.getSellerOrders(ctx, order);
        // Only return seller orders on those channels to which the active user has access.
        const userChannelIds = ctx.session?.user?.channelPermissions.map(cp => cp.id) ?? [];
        return sellerOrders.filter(sellerOrder =>
            sellerOrder.channels.find(c => userChannelIds.includes(c.id)),
        );
    }

    @ResolveField()
    async aggregateOrder(@Ctx() ctx: RequestContext, @Parent() order: Order) {
        const aggregateOrder = await this.orderService.getAggregateOrder(ctx, order);
        const userChannelIds = ctx.session?.user?.channelPermissions.map(cp => cp.id) ?? [];
        // Only return the aggregate order if the active user has permissions on that channel
        return aggregateOrder &&
            userChannelIds.find(id => aggregateOrder.channels.find(channel => idsAreEqual(channel.id, id)))
            ? aggregateOrder
            : undefined;
    }
}
