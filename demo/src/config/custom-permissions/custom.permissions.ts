import { Permission } from '@gseller/core';
import { manageChannelAddressPermission } from '../../plugins/store-config/channel-address/permission'
import { manageChannelBannerPermission } from '../../plugins/store-config/channel-banner/permission'
import { manageChannelFinancesPermission } from '../../plugins/store-config/channel-finances/permission'
import { manageChannelSocialMediaPermission } from '../../plugins/store-config/channel-social-media/permission'
import { manageLayoutPermission } from '../..//plugins/layouts/permission';

export const customPermissions: Permission[] = [
    // Address
    manageChannelAddressPermission.Create,
    manageChannelAddressPermission.Update,
    manageChannelAddressPermission.Delete,
    manageChannelAddressPermission.Read,
    // Finances
    manageChannelFinancesPermission.Create,
    manageChannelFinancesPermission.Update,
    manageChannelFinancesPermission.Delete,
    manageChannelFinancesPermission.Read,
    // SocialMedia
    manageChannelSocialMediaPermission.Create,
    manageChannelSocialMediaPermission.Update,
    manageChannelSocialMediaPermission.Delete,
    manageChannelSocialMediaPermission.Read,
    // Banner
    manageChannelBannerPermission.Create,
    manageChannelBannerPermission.Update,
    manageChannelBannerPermission.Delete,
    manageChannelBannerPermission.Read,
    // Layout
    manageLayoutPermission.Read,
    manageLayoutPermission.Create,
]