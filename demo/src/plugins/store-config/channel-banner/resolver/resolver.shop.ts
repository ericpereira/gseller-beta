import { Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, Permission, RequestContext } from "@gseller/core";
import { ChannelBannerShopService } from "../services/service.shop";

@Resolver()
export class ChannelBannerShopResolver {
  constructor(private channelBannerShopService: ChannelBannerShopService) { }

  @Query()
  async channelBanners(@Ctx() ctx: RequestContext) {
    return this.channelBannerShopService.channelBanners(ctx);
  }
}
