import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AddFulfillmentToOrderResult,
    CancelOrderResult,
    CancelPaymentResult,
    MutationAddFulfillmentToOrderArgs,
    MutationAddManualPaymentToOrderArgs,
    MutationAddNoteToOrderArgs,
    MutationCancelOrderArgs,
    MutationCancelPaymentArgs,
    MutationDeleteOrderNoteArgs,
    MutationModifyOrderArgs,
    MutationRefundOrderArgs,
    MutationSetOrderCustomFieldsArgs,
    MutationSettlePaymentArgs,
    MutationSettleRefundArgs,
    MutationTransitionFulfillmentToStateArgs,
    MutationTransitionOrderToStateArgs,
    MutationTransitionPaymentToStateArgs,
    MutationUpdateOrderNoteArgs,
    Permission,
    QueryOrderArgs,
    QueryOrdersArgs,
    RefundOrderResult,
    SettlePaymentResult,
    TransitionPaymentToStateResult,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { ErrorResultUnion, isGraphQlErrorResult } from '../../../common/error/error-result';
import { TransactionalConnection } from '../../../connection';
import { Order } from '../../../entity/order/order.entity';
import { OrderState } from '../../../service/helpers/order-state-machine/order-state';
import { OrderService } from '../../../service/services/order.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver()
export class OrderResolver {
    constructor(private orderService: OrderService, private connection: TransactionalConnection) {}

    @Query()
    @Allow(Permission.ReadOrder)
    orders(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryOrdersArgs,
        @Relations(Order) relations: RelationPaths<Order>,
    ): Promise<PaginatedList<Order>> {
        return this.orderService.findAll(ctx, args.options || undefined, relations);
    }

    @Query()
    @Allow(Permission.ReadOrder)
    async order(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryOrderArgs,
        @Relations(Order) relations: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        return this.orderService.findOne(ctx, args.id, relations);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async cancelOrder(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCancelOrderArgs,
    ): Promise<ErrorResultUnion<CancelOrderResult, Order>> {
        return this.orderService.cancelOrder(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async setOrderCustomFields(@Ctx() ctx: RequestContext, @Args() args: MutationSetOrderCustomFieldsArgs) {
        return this.orderService.updateCustomFields(ctx, args.input.id, args.input.customFields);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async transitionOrderToState(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationTransitionOrderToStateArgs,
    ) {
        return this.orderService.transitionToState(ctx, args.id, args.state as OrderState);
    }

    @Transaction('manual')
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async modifyOrder(@Ctx() ctx: RequestContext, @Args() args: MutationModifyOrderArgs) {
        await this.connection.startTransaction(ctx);
        const result = false

        if (args.input.dryRun || isGraphQlErrorResult(result)) {
            await this.connection.rollBackTransaction(ctx);
        } else {
            await this.connection.commitOpenTransaction(ctx);
        }

        return result;
    }
}
