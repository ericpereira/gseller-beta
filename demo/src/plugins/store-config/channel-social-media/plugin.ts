import { PluginCommonModule, VendurePlugin } from "@ericpereiraglobalsys/core";

import { AdminChannelSocialMediaResolver } from "./resolvers/admin.resolver";
import AdminSchema from "./schemas/admin.schema";
import { ChannelSocialMedia } from "./entities/social-media.entity";
import { ChannelSocialMediaService } from "./services/admin.service";
import { ShopChannelSocialMediaResolver } from "./resolvers/shop.resolver";
import ShopSchema from "./schemas/shop.schema";
import { manageChannelSocialMediaPermission } from "./permission";

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [ChannelSocialMedia],
  imports: [PluginCommonModule],
  providers: [ChannelSocialMediaService],
  configuration: (config) => {
    config.authOptions.customPermissions.push(manageChannelSocialMediaPermission)
    return config;
  },
  adminApiExtensions: {
    schema: AdminSchema,
    resolvers: [AdminChannelSocialMediaResolver],
  },
  shopApiExtensions: {
    schema: ShopSchema,
    resolvers: [ShopChannelSocialMediaResolver],
  },
})
export class ChannelSocialMediaPlugin { }
