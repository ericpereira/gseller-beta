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
import { Order } from './order/order.entity';
import { OrderLine } from './order-line/order-line.entity';
import { OrderLineReference } from './order-line-reference/order-line-reference.entity';
import { OrderModificationLine } from './order-line-reference/order-modification-line.entity';
import { OrderModification } from './order-modification/order-modification.entity';
import { ProductAsset } from './product/product-asset.entity';
import { ProductTranslation } from './product/product-translation.entity';
import { Product } from './product/product.entity';
import { ProductOptionTranslation } from './product-option/product-option-translation.entity';
import { ProductOption } from './product-option/product-option.entity';
import { ProductOptionGroupTranslation } from './product-option-group/product-option-group-translation.entity';
import { ProductOptionGroup } from './product-option-group/product-option-group.entity';
import { ProductVariantAsset } from './product-variant/product-variant-asset.entity';
import { ProductVariantPrice } from './product-variant/product-variant-price.entity';
import { ProductVariantTranslation } from './product-variant/product-variant-translation.entity';
import { ProductVariant } from './product-variant/product-variant.entity';
import { Country } from './region/country.entity';
import { Province } from './region/province.entity';
import { RegionTranslation } from './region/region-translation.entity';
import { Region } from './region/region.entity';
import { Role } from './role/role.entity';
import { Seller } from './seller/seller.entity';
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
    OrderModificationLine,
    NativeAuthenticationMethod,
    Order,
    OrderLine,
    OrderLineReference,
    OrderModification,
    Product,
    ProductAsset,
    ProductOption,
    ProductOptionGroup,
    ProductOptionGroupTranslation,
    ProductOptionTranslation,
    ProductTranslation,
    ProductVariant,
    ProductVariantAsset,
    ProductVariantPrice,
    ProductVariantTranslation,
    Province,
    Region,
    RegionTranslation,
    Role,
    Session,
    Tag,
    User,
    Seller,
    Zone,
};
