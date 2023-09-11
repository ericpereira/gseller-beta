import { PluginCommonModule, VendurePlugin } from "@vendure/core";

import { ChannelDetailsService } from "./services/shop.service";
import { ShopChannelDetailsResolver } from "./resolver/shop.resolver";
import ShopSchema from "./schemas/shop.schema";

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [ChannelDetailsService],
  shopApiExtensions: {
    schema: ShopSchema,
    resolvers: [ShopChannelDetailsResolver],
  }
})
export class ChannelDetailsPlugin { }