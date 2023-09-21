import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow } from '@gseller/core';
import { ChannelSocialMediaService } from '../services/admin.service';
import { manageChannelSocialMediaPermission } from '../permission';
import { CreateChannelSocialMediaInput, UpdateChannelSocialMediaInput } from '@gseller/common/lib/generated-types';

@Resolver()
export class AdminChannelSocialMediaResolver {

  constructor(
    private channelSocialMediaService: ChannelSocialMediaService
  ) { }

  @Allow(manageChannelSocialMediaPermission.Create)
  @Mutation()
  async createChannelSocialMedia(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateChannelSocialMediaInput
  ) {
    return this.channelSocialMediaService.create(ctx, input);
  }

  @Allow(manageChannelSocialMediaPermission.Update)
  @Mutation()
  async updateChannelSocialMedia(
    @Ctx() ctx: RequestContext,
    @Args('input') input: UpdateChannelSocialMediaInput
  ) {
    return this.channelSocialMediaService.update(ctx, input);
  }

  @Allow(manageChannelSocialMediaPermission.Delete)
  @Mutation()
  async deleteChannelSocialMedia(@Ctx() ctx: RequestContext, @Args('id') id: string) {
    return this.channelSocialMediaService.delete(ctx, id);
  }

  @Allow(manageChannelSocialMediaPermission.Read)
  @Query()
  async getChannelSocialMedia(@Ctx() ctx: RequestContext) {
    return this.channelSocialMediaService.getChannelSocialMedia(ctx);
  }
}
