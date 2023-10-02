import { PluginCommonModule, VendurePlugin } from "@ericpereiraglobalsys/core";

import { AdminChannelAddressResolver } from "./resolvers/admin.resolver";
import AdminSchema from "./schemas/admin.schema";
import { ChannelAddress } from "./entities/channel-address.entity";
import { ChannelAddressServiceAdmin } from "./services/admin.service";
import { ChannelAddressServiceShop } from "./services/shop.service";
import { ShopChannelAddressResolver } from "./resolvers/shop.resolver";
import ShopSchema from "./schemas/shop.schema";
import { manageChannelAddressPermission } from "./permission";

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [ChannelAddress],
  imports: [PluginCommonModule],
  providers: [ChannelAddressServiceAdmin, ChannelAddressServiceShop],
  adminApiExtensions: {
    schema: AdminSchema,
    resolvers: [AdminChannelAddressResolver],
  },
  shopApiExtensions: {
    schema: ShopSchema,
    resolvers: [ShopChannelAddressResolver],
  },
  configuration: (config) => {
    config.authOptions.customPermissions.push(manageChannelAddressPermission)
    return config;
  },
})
export class ChannelAddressPlugin { }
