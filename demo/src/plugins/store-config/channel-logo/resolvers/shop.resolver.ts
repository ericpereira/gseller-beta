import { Query, Resolver } from "@nestjs/graphql";
import { Allow, Asset, Ctx, Permission, RequestContext } from "@ericpereiraglobalsys/core";
import { ChannelDetailsService } from "../services/shop.service";

@Resolver()
export class ChannelLogoResolver {
  constructor(private channelDetailsService: ChannelDetailsService) { }

  @Query()
  async channelLogo(@Ctx() ctx: RequestContext) {
    return this.channelDetailsService.getChannel(ctx);
  }
}
