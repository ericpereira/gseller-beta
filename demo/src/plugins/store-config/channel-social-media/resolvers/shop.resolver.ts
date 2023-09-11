import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow } from '@vendure/core';
import { ChannelSocialMediaService } from '../services/admin.service';
import { manageChannelSocialMediaPermission } from '../permission';
import { CreateChannelSocialMediaInput, UpdateChannelSocialMediaInput } from '@vendure/common/lib/generated-types';

@Resolver()
export class ShopChannelSocialMediaResolver {

  constructor(
    private channelSocialMediaService: ChannelSocialMediaService
  ) { }

  @Query()
  async getChannelSocialMedia(@Ctx() ctx: RequestContext) {
    return this.channelSocialMediaService.getChannelSocialMedia(ctx);
  }
}
