import { Args, Query, Resolver, ResolveField } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@ericpereiraglobalsys/core";
import { ChannelAddressServiceShop } from "../services/shop.service";
import { ChannelAddress } from "../entities/channel-address.entity";

@Resolver()
export class ShopChannelAddressResolver {
  constructor(private channelAddressServiceShop: ChannelAddressServiceShop) {}

  @Query()
  async getChannelAddress(@Ctx() ctx: RequestContext) {
    return this.channelAddressServiceShop.getChannelAddress(ctx);
  }

  @Query()
  async getActiveChannelAddress(@Ctx() ctx: RequestContext) {
    return this.channelAddressServiceShop.getActiveChannelAddress(ctx);
  }
}
