import { Module } from '@nestjs/common';

import { CacheModule } from '../cache/cache.module';
import { ConfigModule } from '../config/config.module';
import { ConnectionModule } from '../connection/connection.module';
import { DataImportModule } from '../data-import/data-import.module';
import { JobQueueModule } from '../job-queue/job-queue.module';
import { createDynamicGraphQlModulesForPlugins } from '../plugin/dynamic-plugin-api.module';
import { ServiceModule } from '../service/service.module';

import { ConfigurableOperationCodec } from './common/configurable-operation-codec';
import { CustomFieldRelationResolverService } from './common/custom-field-relation-resolver.service';
import { IdCodecService } from './common/id-codec.service';
import { AdministratorResolver } from './resolvers/admin/administrator.resolver';
import { AssetResolver } from './resolvers/admin/asset.resolver';
import { AuthResolver } from './resolvers/admin/auth.resolver';
import { ChannelResolver } from './resolvers/admin/channel.resolver';
import { CountryResolver } from './resolvers/admin/country.resolver';
import { CustomerGroupResolver } from './resolvers/admin/customer-group.resolver';
import { CustomerResolver } from './resolvers/admin/customer.resolver';
import { DraftOrderResolver } from './resolvers/admin/draft-order.resolver';
import { GlobalSettingsResolver } from './resolvers/admin/global-settings.resolver';
import { JobResolver } from './resolvers/admin/job.resolver';
import { OrderResolver } from './resolvers/admin/order.resolver';
import { RoleResolver } from './resolvers/admin/role.resolver';
import { SearchResolver } from './resolvers/admin/search.resolver';
import { TagResolver } from './resolvers/admin/tag.resolver';
import { ZoneResolver } from './resolvers/admin/zone.resolver';
import { AdministratorEntityResolver } from './resolvers/entity/administrator-entity.resolver';
import { AssetEntityResolver } from './resolvers/entity/asset-entity.resolver';
import { ChannelEntityResolver } from './resolvers/entity/channel-entity.resolver';
import { CountryEntityResolver } from './resolvers/entity/country-entity.resolver';
import {
    CustomerAdminEntityResolver,
    CustomerEntityResolver,
} from './resolvers/entity/customer-entity.resolver';
import { CustomerGroupEntityResolver } from './resolvers/entity/customer-group-entity.resolver';
import { JobEntityResolver } from './resolvers/entity/job-entity.resolver';
import { OrderAdminEntityResolver, OrderEntityResolver } from './resolvers/entity/order-entity.resolver';
import { OrderLineEntityResolver } from './resolvers/entity/order-line-entity.resolver';
import { RoleEntityResolver } from './resolvers/entity/role-entity.resolver';
import { UserEntityResolver } from './resolvers/entity/user-entity.resolver';
import { ZoneEntityResolver } from './resolvers/entity/zone-entity.resolver';
import { ShopAuthResolver } from './resolvers/shop/shop-auth.resolver';
import { ShopCustomerResolver } from './resolvers/shop/shop-customer.resolver';
import { ShopEnvironmentResolver } from './resolvers/shop/shop-environment.resolver';
import { ShopOrderResolver } from './resolvers/shop/shop-order.resolver';

const adminResolvers = [
    AdministratorResolver,
    AssetResolver,
    AuthResolver,
    ChannelResolver,
    CountryResolver,
    CustomerGroupResolver,
    CustomerResolver,
    DraftOrderResolver,
    GlobalSettingsResolver,
    JobResolver,
    OrderResolver,
    RoleResolver,
    SearchResolver,
    TagResolver,
    ZoneResolver,
];

const shopResolvers = [
    ShopAuthResolver,
    ShopCustomerResolver,
    ShopOrderResolver,
    ShopEnvironmentResolver,
];

export const entityResolvers = [
    AssetEntityResolver,
    ChannelEntityResolver,
    CountryEntityResolver,
    CustomerEntityResolver,
    CustomerGroupEntityResolver,
    OrderEntityResolver,
    OrderLineEntityResolver,
    RoleEntityResolver,
    UserEntityResolver,
    ZoneEntityResolver,
];

export const adminEntityResolvers = [
    AdministratorEntityResolver,
    CustomerAdminEntityResolver,
    OrderAdminEntityResolver,
    JobEntityResolver,
];

/**
 * The internal module containing some shared providers used by more than
 * one API module.
 */
@Module({
    imports: [ConfigModule, ServiceModule, CacheModule, ConnectionModule.forRoot()],
    providers: [IdCodecService, ConfigurableOperationCodec, CustomFieldRelationResolverService],
    exports: [
        IdCodecService,
        CacheModule,
        ConfigModule,
        ConfigurableOperationCodec,
        CustomFieldRelationResolverService,
        ServiceModule,
        ConnectionModule.forRoot(),
    ],
})
export class ApiSharedModule {}

/**
 * The internal module containing the Admin GraphQL API resolvers
 */
@Module({
    imports: [
        ApiSharedModule,
        JobQueueModule,
        DataImportModule,
        ...createDynamicGraphQlModulesForPlugins('admin'),
    ],
    providers: [...adminResolvers, ...entityResolvers, ...adminEntityResolvers],
    exports: [...adminResolvers],
})
export class AdminApiModule {}

/**
 * The internal module containing the Shop GraphQL API resolvers
 */
@Module({
    imports: [ApiSharedModule, ...createDynamicGraphQlModulesForPlugins('shop')],
    providers: [...shopResolvers, ...entityResolvers],
    exports: [...shopResolvers],
})
export class ShopApiModule {}
