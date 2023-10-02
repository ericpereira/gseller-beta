import { PluginCommonModule, VendurePlugin } from "@ericpereiraglobalsys/core";

import { ProductCustomFields } from "./custom-fields";

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [],
  configuration: (config) => {
    config.customFields.Product.push(...ProductCustomFields!);
    return config;
  },
})
export class FeaturedPlugin { }
