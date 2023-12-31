import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@ericpereiraglobalsys/core";
import { ChannelDetailsService } from "../services/shop.service";

@Resolver()
export class ShopChannelDetailsResolver {
  constructor(private channelDetailsService: ChannelDetailsService) { }

  @Query()
  async currentChannelDetails(@Ctx() ctx: RequestContext) {
    return this.channelDetailsService.getChannel(ctx);
  }
}
