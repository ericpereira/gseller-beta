import { Asset, PluginCommonModule, VendurePlugin } from '@vendure/core';

import { CustomAssetPlugin } from '../../asset/asset.plugin';
import { CustomerAssetResolver } from './customer-asset.resolver';
import { CustomerAssetService } from './customer-asset.service';
import { shopApiExtensions } from './schema/shop.schema';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule, CustomAssetPlugin],
  providers: [CustomerAssetService],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [CustomerAssetResolver],
  },
  configuration: (config) => {
    config.customFields.Customer = [{
      name: 'avatar',
      type: 'relation',
      entity: Asset,
      graphQLType: 'Asset',
      eager: false,
    }];
    return config;
  },
  exports: [CustomerAssetService],
})
export class CustomerAssetPlugin { }
