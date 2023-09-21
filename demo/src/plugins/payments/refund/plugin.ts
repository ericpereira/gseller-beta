import { PluginCommonModule, VendurePlugin } from "@gseller/core";
import { RefundRequest } from "./entities/refund-request.entity";
import AdminSchema from "./schema/admin.schema";
import { RefundRequestShopResolver } from "./resolvers/shop.resolver";
import { RefundRequestService } from "./service/shop.service";
import { RefundRequestAdminResolver } from "./resolvers/admin.resolver";
import { RefundRequestAdminService } from "./service/admin.service";
import ShopSchema from "./schema/shop.schema";

@VendurePlugin({
  compatibility: "2.0.1",
  entities: [RefundRequest],
  imports: [PluginCommonModule],
  providers: [RefundRequestService, RefundRequestAdminService],
  configuration: (config) => {
    return config;
  },
  adminApiExtensions: {
    schema: AdminSchema,
    resolvers: [RefundRequestAdminResolver],
  },
  shopApiExtensions: {
    schema: ShopSchema,
    resolvers: [RefundRequestShopResolver],
  },
})
export class RefundRequestPlugin { }
