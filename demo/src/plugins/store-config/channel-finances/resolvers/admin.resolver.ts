
import { Allow, Ctx, RequestContext, Transaction } from '@ericpereiraglobalsys/core';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { FinancesService } from '../services/bank-account.service';
import { manageChannelFinancesPermission as Permission } from '../permission';
import { AccountHolderInput, PaymentAccountInput } from '@ericpereiraglobalsys/common/lib/generated-types'
import { AccountHolderService } from '../services/account-holder.service';
@Resolver()
export class FinancesResolver {

    constructor(
        private financesService: FinancesService,
        private accountHolderService: AccountHolderService
    ) { }

    @Mutation()
    @Allow(Permission.Update)
    @Transaction()
    async createAccountHolder(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: AccountHolderInput }
    ) {
        return this.accountHolderService.create(ctx, args.input);
    }

    @Query()
    @Allow(Permission.Read)
    async channelCurrentAccountHolder(
        @Ctx() ctx: RequestContext,
    ) {
        return this.accountHolderService.findOne(ctx);
    }

    @Mutation()
    @Allow(Permission.Read)
    async updateAccountHolder(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: AccountHolderInput }
    ) {
        return this.accountHolderService.update(ctx, args.input);
    }

    // @Mutation()
    // @Allow(Permission.Delete)
    // @Transaction()
    // async deleteAccountHolder(
    //     @Ctx() ctx: RequestContext,
    //     @Args() args: { id: string }
    // ) {
    //     return this.accountHolderService.delete(ctx, args.id);
    // }

    @Mutation()
    @Allow(Permission.Create)
    @Transaction()
    async createChannelPaymentAccount(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: PaymentAccountInput }
    ) {
        return this.financesService.create(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.Update)
    @Transaction()
    async updateChannelPaymentAccount(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: PaymentAccountInput }
    ) {
        return this.financesService.update(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.Delete)
    @Transaction()
    async deleteChannelPaymentAccount(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: string }
    ) {
        return this.financesService.delete(ctx, args.id);
    }

    @Query()
    @Allow(Permission.Read)
    async channelCurrentPaymentAccount(
        @Ctx() ctx: RequestContext,
    ) {
        return this.financesService.findOne(ctx);
    }

}
