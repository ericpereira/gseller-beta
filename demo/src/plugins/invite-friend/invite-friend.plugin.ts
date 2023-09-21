import { PluginCommonModule, VendurePlugin } from '@gseller/core';

import { InviteFriendResolver } from './invite-friend-shop.resolver';
import { InviteFriendService } from './invite-friend.service';
import { adminApiExtensions } from './schema/adminschema';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [InviteFriendService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [InviteFriendResolver],
  },
})
export class InviteFriendPlugin { }
