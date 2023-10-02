import { Asset, PluginCommonModule, VendurePlugin } from "@ericpereiraglobalsys/core";

import { ChannelDetailsService } from "./services/shop.service";
import { ChannelLogoResolver as ChannelLogoAdminResolver } from "./resolvers/admin.resolver";
import { ChannelLogoResolver as ChannelLogoShopResolver } from "./resolvers/shop.resolver";
import adminApiExtensions from "./schemas/admin.schema";
import shopApiExtensions from "./schemas/shop.schema";

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [ChannelDetailsService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ChannelLogoAdminResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ChannelLogoShopResolver],
  },
  configuration: (config) => {
    config.customFields.Channel.push({
      name: "logo",
      type: "relation",
      entity: Asset,
      graphQLType: 'Asset',
      eager: false,
    });
    return config;
  },
})
export class ChannelLogoPlugin { }
