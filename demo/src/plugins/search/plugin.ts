import { PluginCommonModule, TransactionalConnection, VendurePlugin } from '@gseller/core';

import { CollectionCustomFields } from './custom-fields';
import { ContextStrategy } from './context-auth-strategy';
import { SearchCustomResolver } from './resolver';
import SearchCustomSchema from './search-custom.schema';
import { SearchCustomService } from './search-custom.service';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [TransactionalConnection, SearchCustomService, ContextStrategy],
  shopApiExtensions: {
    schema: SearchCustomSchema,
    resolvers: [SearchCustomResolver],
  },
  configuration: (config) => {
    config.customFields.Collection.push(...CollectionCustomFields!);

    return config;
  },
})
export class SearchCustom { }
