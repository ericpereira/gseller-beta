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
    RequestContext
  } from '@ericpereiraglobalsys/core';
  import { RefundRequest } from '../entities/refund-request.entity';
  import { RefundRequestAdminService } from '../service/admin.service';
import { InputCreateRefundRequest } from '../types';
  @Resolver()
  export class RefundRequestAdminResolver {
    constructor(
      private refundRequestService: RefundRequestAdminService) {
    }
  
    @Allow(Permission.SuperAdmin)
    @Mutation()
    async createRefundRequest(
      @Args() args: {
        input: InputCreateRefundRequest
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.refundRequestService.create(ctx, args.input);
    }
  
    @Allow(Permission.SuperAdmin)
    @Query()
    async getAllRefundRequest(
        @Args() args: {
            customerId?: ID
        },
        @Ctx() ctx: RequestContext
    ): Promise<any> {
      return this.refundRequestService.findAll(ctx, args?.customerId);
    }
  
    @Allow(Permission.SuperAdmin)
    @Query()
    async getRefundRequest(
        @Args() args: { id: number },
        @Ctx() ctx: RequestContext
    ) {
      return this.refundRequestService.find(ctx, args.id)
    }
  
    @Allow(Permission.SuperAdmin)
    @Mutation()
    async updateRefundRequest(
      @Args() args: {
        id: number,
        input: Partial<RefundRequest>
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.refundRequestService.update(ctx, args.id, args.input)
    }
  
    @Allow(Permission.SuperAdmin)
    @Mutation()
    async deleteRefundRequest(
      @Args() args: {
        id: number
      },
      @Ctx() ctx: RequestContext
    ) {
      return this.refundRequestService.delete(ctx, args.id)
    }
}