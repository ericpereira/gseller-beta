import { PluginCommonModule, VendurePlugin } from '@gseller/core';

import { CustomAssetService } from './asset.service';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [CustomAssetService],
  exports: [CustomAssetService],
})
export class CustomAssetPlugin { }
