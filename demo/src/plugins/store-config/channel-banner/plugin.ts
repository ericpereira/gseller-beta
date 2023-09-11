import { PluginCommonModule, VendurePlugin } from "@vendure/core";

import { ChannelBanner } from "./entities/channel-banner.entity";
import { ChannelBannerAdminService } from "./services/service.admin";
import { ChannelBannerResolver } from "./resolver/resolver.admin";
import { ChannelBannerShopResolver } from "./resolver/resolver.shop";
import { ChannelBannerShopService } from "./services/service.shop";
import adminApiExtensions from "./schemas/admin.schema";
import { manageChannelBannerPermission } from "./permission";
import shopApiExtensions from "./schemas/shop.schema";

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [ChannelBanner],
  imports: [PluginCommonModule],
  providers: [ChannelBannerAdminService, ChannelBannerShopService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ChannelBannerResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ChannelBannerShopResolver],
  },
  configuration: (config) => {
    config.authOptions.customPermissions.push(manageChannelBannerPermission)
    return config;
  },
})
export class ChannelBannerPlugin { }
