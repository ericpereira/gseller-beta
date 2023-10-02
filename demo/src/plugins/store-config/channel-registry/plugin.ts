import { PluginCommonModule, VendurePlugin } from '@ericpereiraglobalsys/core';

import { ContextStrategy } from './context-auth-strategy';
import { ResponseHeaderMiddleware } from './middleware';
import { StoreRegistryResolver } from './store-registry.resolver';
import { StoreRegistryService } from './store-registry.service';
import { adminApiExtensions } from './schema/admin.schema';
import { customFields } from './custom-fields';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [ContextStrategy, StoreRegistryService, ResponseHeaderMiddleware],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [StoreRegistryResolver],
  },
  configuration: (config) => {
    config.customFields.Administrator.push(...customFields!);
    return config;
  },
})
export class StoreRegistryPlugin { }
