import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { Layout } from "./entities/layout.entity";
import { LayoutCategory } from "./entities/layout-category.entity";
import { ChannelLayout } from "./entities/channel-layout.entity";
import AdminSchema from "./schema/admin.schema";
import { LayoutService } from "./services/layout.service";
import { LayoutAdminResolver } from "./resolvers/admin.resolver";
import { LayoutCategoryService } from "./services/layout-category.service";
import { ChannelLayoutService } from "./services/channel-layout.service";
import { manageLayoutPermission } from "./permission";

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [Layout, LayoutCategory, ChannelLayout],
  imports: [PluginCommonModule],
  providers: [LayoutService, LayoutCategoryService, ChannelLayoutService],
  configuration: (config) => {
    config.authOptions.customPermissions.push(manageLayoutPermission)
    return config;
  },
  adminApiExtensions: {
    schema: AdminSchema,
    resolvers: [LayoutAdminResolver],
  }
})
export class LayoutsPlugin { }
