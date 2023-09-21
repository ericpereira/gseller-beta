import {
    Args,
    Query,
    Resolver,
    Mutation
  } from '@nestjs/graphql';
  import {
    Allow,
    Ctx,
    ID,
    Permission,
    RequestContext,
    Transaction
  } from '@gseller/core';
  import { RefundRequestService } from '../service/shop.service';
import { InputCreateRefundRequest } from '../types';

  
  @Resolver()
  export class RefundRequestShopResolver {
    constructor(
      private refundRequestService: RefundRequestService) {
    }
  
    @Allow(Permission.Owner)
    @Mutation()
    async createRefundRequest(
      @Args() args: {
        input: InputCreateRefundRequest
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.refundRequestService.create(ctx, args.input);
    }
  
    @Allow(Permission.Owner)
    @Query()
    async getAllRefundRequest(
        @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.refundRequestService.findAll(ctx);
    }
  
    @Allow(Permission.Owner)
    @Query()
    async getRefundRequest(
        @Args() args: { id: number },
        @Ctx() ctx: RequestContext
    ) {
      return this.refundRequestService.find(ctx, args.id)
    }
  
    @Allow(Permission.Owner)
    @Mutation()
    async deleteRefundRequest(
      @Args() args: {
        id: number
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.refundRequestService.delete(ctx, args.id)
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.Owner)
    async uploadFile(
      @Ctx() ctx: RequestContext,
      @Args() args: { file: any, refundRequestOrderId: ID },
    ) {
      return this.refundRequestService.uploadFile(ctx, args);
    }
}