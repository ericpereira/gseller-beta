import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { AdministratorAssetService } from './administrator-asset.service';
import { CustomAssetPlugin } from '../../asset/asset.plugin';
import { CustomerAssetResolver } from './administrator-asset.resolver';
import { adminApiExtensions } from './schema/admin.schema';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule, CustomAssetPlugin],
  providers: [AdministratorAssetService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [CustomerAssetResolver],
  },
  exports: [AdministratorAssetService],
})
export class AdministratorAssetPlugin { }
