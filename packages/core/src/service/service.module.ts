import { Module } from '@nestjs/common';

import { CacheModule } from '../cache/cache.module';
import { ConfigModule } from '../config/config.module';
import { ConnectionModule } from '../connection/connection.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { JobQueueModule } from '../job-queue/job-queue.module';

import { CustomFieldRelationService } from './helpers/custom-field-relation/custom-field-relation.service';
import { EntityHydrator } from './helpers/entity-hydrator/entity-hydrator.service';
import { ExternalAuthenticationService } from './helpers/external-authentication/external-authentication.service';
import { ListQueryBuilder } from './helpers/list-query-builder/list-query-builder';
import { LocaleStringHydrator } from './helpers/locale-string-hydrator/locale-string-hydrator';
import { PasswordCipher } from './helpers/password-cipher/password-cipher';
import { RequestContextService } from './helpers/request-context/request-context.service';
import { SlugValidator } from './helpers/slug-validator/slug-validator';
import { TranslatableSaver } from './helpers/translatable-saver/translatable-saver';
import { TranslatorService } from './helpers/translator/translator.service';
import { VerificationTokenGenerator } from './helpers/verification-token-generator/verification-token-generator';
import { InitializerService } from './initializer.service';
import { AdministratorService } from './services/administrator.service';
import { AssetService } from './services/asset.service';
import { AuthService } from './services/auth.service';
import { ChannelService } from './services/channel.service';
import { CountryService } from './services/country.service';
import { CustomerGroupService } from './services/customer-group.service';
import { CustomerService } from './services/customer.service';
import { GlobalSettingsService } from './services/global-settings.service';
import { RoleService } from './services/role.service';
import { SearchService } from './services/search.service';
import { SessionService } from './services/session.service';
import { TagService } from './services/tag.service';
import { UserService } from './services/user.service';
import { ZoneService } from './services/zone.service';

const services = [
    AdministratorService,
    AssetService,
    AuthService,
    ChannelService,
    CountryService,
    CustomerGroupService,
    CustomerService,
    GlobalSettingsService,
    RoleService,
    SearchService,
    SessionService,
    TagService,
    UserService,
    ZoneService,
];

const helpers = [
    TranslatableSaver,
    PasswordCipher,
    ListQueryBuilder,
    VerificationTokenGenerator,
    SlugValidator,
    ExternalAuthenticationService,
    CustomFieldRelationService,
    LocaleStringHydrator,
    EntityHydrator,
    RequestContextService,
    TranslatorService,
];

/**
 * The ServiceCoreModule is imported internally by the ServiceModule. It is arranged in this way so that
 * there is only a single instance of this module being instantiated, and thus the lifecycle hooks will
 * only run a single time.
 */
@Module({
    imports: [ConnectionModule, ConfigModule, EventBusModule, CacheModule, JobQueueModule],
    providers: [...services, ...helpers, InitializerService],
    exports: [...services, ...helpers],
})
export class ServiceCoreModule {}

/**
 * The ServiceModule is responsible for the service layer, i.e. accessing the database
 * and implementing the main business logic of the application.
 *
 * The exported providers are used in the ApiModule, which is responsible for parsing requests
 * into a format suitable for the service layer logic.
 */
@Module({
    imports: [ServiceCoreModule],
    exports: [ServiceCoreModule],
})
export class ServiceModule {}
