import { PluginCommonModule, VendurePlugin } from '@gseller/core';

import { Contact } from './entities/contact.entities';
import { ContactAdminResolver } from './contact-admin.resolver';
import { ContactService } from './contact.service';
import { ContactShopResolver } from './contact-shop.resolver';
import { adminApiExtensions } from './schema/admin.schema';
import { shopApiExtensions } from './schema/shop.schema';

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [Contact],
  imports: [PluginCommonModule],
  providers: [ContactService],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ContactShopResolver],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [ContactAdminResolver],
  },
})
export class ContactPlugin { }
