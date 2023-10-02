import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  Permission,
  RequestContext,
  Transaction,
} from "@ericpereiraglobalsys/core";
import { ChannelBannerAdminService } from "../services/service.admin";
import {
  CreateChannelBannerWithAssetIdInput,
  CreateChannelBannerWithAssetInput,
  UpdateChannelBanner,
} from "@ericpereiraglobalsys/common/lib/generated-types";
import { manageChannelBannerPermission } from "../permission";

@Resolver()
export class ChannelBannerResolver {
  constructor(private channelBannerAdminService: ChannelBannerAdminService) { }

  //@Transaction()
  @Mutation()
  @Allow(manageChannelBannerPermission.Create, Permission.SuperAdmin)
  async setChannelBanner(
    @Ctx() ctx: RequestContext,
    @Args("args") args: CreateChannelBannerWithAssetInput
  ) {
    return this.channelBannerAdminService.setChannelBanner(ctx, args);
  }

  @Transaction()
  @Mutation()
  @Allow(manageChannelBannerPermission.Create, Permission.SuperAdmin)
  async setChannelBannerWithAssetId(
    @Ctx() ctx: RequestContext,
    @Args("args") args: CreateChannelBannerWithAssetIdInput
  ) {
    return this.channelBannerAdminService.setChannelBannerAssetId(ctx, args);
  }

  @Transaction()
  @Mutation()
  @Allow(manageChannelBannerPermission.Update, Permission.SuperAdmin)
  async updateChannelBanner(
    @Ctx() ctx: RequestContext,
    @Args("args") args: UpdateChannelBanner
  ) {
    return this.channelBannerAdminService.updateChannelBanner(ctx, args);
  }

  @Transaction()
  @Mutation()
  @Allow(manageChannelBannerPermission.Delete, Permission.SuperAdmin)
  async deleteChannelBanner(
    @Ctx() ctx: RequestContext,
    @Args("bannerId") bannerId: string
  ) {
    return this.channelBannerAdminService.deleteChannelBanner(ctx, bannerId);
  }

  @Query()
  async getAllBanners(@Ctx() ctx: RequestContext) {
    return this.channelBannerAdminService.getAllBanner(ctx);
  }
}
