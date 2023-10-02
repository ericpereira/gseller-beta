import {
  Allow,
  Ctx,
  RequestContext
} from '@ericpereiraglobalsys/core';
import {
  Args,
  Mutation,
  Resolver,
  Query
} from '@nestjs/graphql';
import { ChannelAddressServiceAdmin } from '../services/admin.service';
import { manageChannelAddressPermission } from '../permission';
import { ChannelAddressInput } from '@ericpereiraglobalsys/common/lib/generated-types';
@Resolver()
export class AdminChannelAddressResolver {

  constructor(
    private channelAddressServiceAdmin: ChannelAddressServiceAdmin
  ) { }

  @Allow(manageChannelAddressPermission.Create)
  @Mutation()
  async registerChannelAddress(
    @Ctx() ctx: RequestContext,
    @Args('input') input: ChannelAddressInput
  ) {
    return this.channelAddressServiceAdmin.registerChannelAddress(ctx, input);
  }

  @Allow(manageChannelAddressPermission.Update)
  @Mutation()
  async updateChannelAddress(
    @Ctx() ctx: RequestContext,
    @Args('input') input: ChannelAddressInput
  ) {
    return this.channelAddressServiceAdmin.updateChannelAddress(ctx, input);
  }

  @Allow(manageChannelAddressPermission.Delete)
  @Mutation()
  async deleteChannelAddress(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string
  ) {
    return this.channelAddressServiceAdmin.deleteChannelAddress(ctx, id);
  }

  @Allow(manageChannelAddressPermission.Read)
  @Query()
  async channelAddress(
    @Ctx() ctx: RequestContext
  ) {
    return this.channelAddressServiceAdmin.getChannelAddress(ctx);
  }

  @Allow(manageChannelAddressPermission.Read)
  @Query()
  async channelDistributionCenter(
    @Ctx() ctx: RequestContext
  ) {
    return this.channelAddressServiceAdmin.getChannelDistributionCenter(ctx);
  }

  @Allow(manageChannelAddressPermission.Update)
  @Mutation()
  async updateChannelDistributionCenter(
    @Ctx() ctx: RequestContext,
    @Args('input') input: ChannelAddressInput
  ) {
    return this.channelAddressServiceAdmin.updateChannelDistributionCenter(ctx, input);
  }

}