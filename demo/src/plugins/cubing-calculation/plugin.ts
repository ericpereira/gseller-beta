import { PluginCommonModule, VendurePlugin } from "@ericpereiraglobalsys/core";

import { ProductVariantsCustomFields } from "./custom-fields";
import { ProductsCubicInformationService } from "./products-cubic-information.service";

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [ProductsCubicInformationService],
  exports: [ProductsCubicInformationService],
  configuration: (config) => {
    config.customFields.ProductVariant.push(...ProductVariantsCustomFields!);

    return config;
  },
})
export class ProductsCubicInformationPlugin { }
