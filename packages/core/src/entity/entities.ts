import { Address } from './address/address.entity';
import { Administrator } from './administrator/administrator.entity';
import { Asset } from './asset/asset.entity';
import { AuthenticationMethod } from './authentication-method/authentication-method.entity';
import { ExternalAuthenticationMethod } from './authentication-method/external-authentication-method.entity';
import { NativeAuthenticationMethod } from './authentication-method/native-authentication-method.entity';
import { Channel } from './channel/channel.entity';
import { Customer } from './customer/customer.entity';
import { CustomerGroup } from './customer-group/customer-group.entity';
import { GlobalSettings } from './global-settings/global-settings.entity';
import { Country } from './region/country.entity';
import { Province } from './region/province.entity';
import { RegionTranslation } from './region/region-translation.entity';
import { Region } from './region/region.entity';
import { Role } from './role/role.entity';
import { AnonymousSession } from './session/anonymous-session.entity';
import { AuthenticatedSession } from './session/authenticated-session.entity';
import { Session } from './session/session.entity';
import { Tag } from './tag/tag.entity';
import { User } from './user/user.entity';
import { Zone } from './zone/zone.entity';

/**
 * A map of all the core database entities.
 */
export const coreEntitiesMap = {
    Address,
    Administrator,
    AnonymousSession,
    Asset,
    AuthenticatedSession,
    AuthenticationMethod,
    Channel,
    Country,
    Customer,
    CustomerGroup,
    ExternalAuthenticationMethod,
    GlobalSettings,
    NativeAuthenticationMethod,
    Province,
    Region,
    RegionTranslation,
    Role,
    Session,
    Tag,
    User,
    Zone,
};
