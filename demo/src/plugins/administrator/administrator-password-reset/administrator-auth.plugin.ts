import { Asset, PluginCommonModule, VendurePlugin } from '@ericpereiraglobalsys/core';

import { AdministratorAvatarResolver } from './administrator-auth.resolver';
import { AdministratorAvatarService } from './administrator-auth.service';
import administratorAuthSchema from './schema/admin.schema';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [AdministratorAvatarService],
  adminApiExtensions: {
    schema: administratorAuthSchema,
    resolvers: [AdministratorAvatarResolver],
  },
})
export class AdministratorAuthPlugin { }
