import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    DEFAULT_AUTH_TOKEN_HEADER_KEY,
    SUPER_ADMIN_USER_IDENTIFIER,
    SUPER_ADMIN_USER_PASSWORD,
    DEFAULT_CHANNEL_TOKEN_KEY,
} from '@vendure/common/lib/shared-constants';

import { TypeORMHealthCheckStrategy } from '../health-check/typeorm-health-check-strategy';
import { InMemoryJobQueueStrategy } from '../job-queue/in-memory-job-queue-strategy';
import { InMemoryJobBufferStorageStrategy } from '../job-queue/job-buffer/in-memory-job-buffer-storage-strategy';

import { DefaultAssetImportStrategy } from './asset-import-strategy/default-asset-import-strategy';
import { DefaultAssetNamingStrategy } from './asset-naming-strategy/default-asset-naming-strategy';
import { NoAssetPreviewStrategy } from './asset-preview-strategy/no-asset-preview-strategy';
import { NoAssetStorageStrategy } from './asset-storage-strategy/no-asset-storage-strategy';
import { BcryptPasswordHashingStrategy } from './auth/bcrypt-password-hashing-strategy';
import { DefaultPasswordValidationStrategy } from './auth/default-password-validation-strategy';
import { NativeAuthenticationStrategy } from './auth/native-authentication-strategy';
import { AutoIncrementIdStrategy } from './entity/auto-increment-id-strategy';
import { DefaultMoneyStrategy } from './entity/default-money-strategy';
import { DefaultLogger } from './logger/default-logger';
import { InMemorySessionCacheStrategy } from './session-cache/in-memory-session-cache-strategy';
import { RuntimeVendureConfig } from './vendure-config';

/**
 * @description
 * The default configuration settings which are used if not explicitly overridden in the bootstrap() call.
 *
 * @docsCategory configuration
 */
export const defaultConfig: RuntimeVendureConfig = {
    defaultChannelToken: null,
    defaultLanguageCode: LanguageCode.en,
    logger: new DefaultLogger(),
    apiOptions: {
        hostname: '',
        port: 3000,
        adminApiPath: 'admin-api',
        adminApiPlayground: false,
        adminApiDebug: false,
        adminListQueryLimit: 1000,
        adminApiValidationRules: [],
        shopApiPath: 'shop-api',
        shopApiPlayground: false,
        shopApiDebug: false,
        shopListQueryLimit: 100,
        shopApiValidationRules: [],
        channelTokenKey: DEFAULT_CHANNEL_TOKEN_KEY,
        cors: {
            origin: true,
            credentials: true,
        },
        middleware: [],
        introspection: true,
        apolloServerPlugins: [],
    },
    authOptions: {
        disableAuth: false,
        tokenMethod: 'cookie',
        cookieOptions: {
            secret: Math.random().toString(36).substr(3),
            httpOnly: true,
            sameSite: 'lax',
        },
        authTokenHeaderKey: DEFAULT_AUTH_TOKEN_HEADER_KEY,
        sessionDuration: '1y',
        sessionCacheStrategy: new InMemorySessionCacheStrategy(),
        sessionCacheTTL: 300,
        requireVerification: true,
        verificationTokenDuration: '7d',
        superadminCredentials: {
            identifier: SUPER_ADMIN_USER_IDENTIFIER,
            password: SUPER_ADMIN_USER_PASSWORD,
        },
        shopAuthenticationStrategy: [new NativeAuthenticationStrategy()],
        adminAuthenticationStrategy: [new NativeAuthenticationStrategy()],
        customPermissions: [],
        passwordHashingStrategy: new BcryptPasswordHashingStrategy(),
        passwordValidationStrategy: new DefaultPasswordValidationStrategy({ minLength: 4 }),
    },
    entityIdStrategy: new AutoIncrementIdStrategy(),
    assetOptions: {
        assetNamingStrategy: new DefaultAssetNamingStrategy(),
        assetStorageStrategy: new NoAssetStorageStrategy(),
        assetPreviewStrategy: new NoAssetPreviewStrategy(),
        permittedFileTypes: ['image/*', 'video/*', 'audio/*', '.pdf'],
        uploadMaxFileSize: 20971520,
    },
    dbConnectionOptions: {
        timezone: 'Z',
        type: 'mysql',
    },
    entityOptions: {
        moneyStrategy: new DefaultMoneyStrategy(),
        channelCacheTtl: 30000,
        zoneCacheTtl: 30000,
        taxRateCacheTtl: 30000,
        metadataModifiers: [],
    },
    importExportOptions: {
        importAssetsDir: __dirname,
        assetImportStrategy: new DefaultAssetImportStrategy(),
    },
    jobQueueOptions: {
        jobQueueStrategy: new InMemoryJobQueueStrategy(),
        jobBufferStorageStrategy: new InMemoryJobBufferStorageStrategy(),
        activeQueues: [],
        prefix: '',
    },
    customFields: {
        Address: [],
        Administrator: [],
        Asset: [],
        Channel: [],
        Collection: [],
        Customer: [],
        CustomerGroup: [],
        Facet: [],
        FacetValue: [],
        Fulfillment: [],
        GlobalSettings: [],
        Order: [],
        OrderLine: [],
        PaymentMethod: [],
        Product: [],
        ProductOption: [],
        ProductOptionGroup: [],
        ProductVariant: [],
        Promotion: [],
        Region: [],
        Seller: [],
        ShippingMethod: [],
        StockLocation: [],
        TaxCategory: [],
        TaxRate: [],
        User: [],
        Zone: [],
    },
    plugins: [],
    systemOptions: {
        healthChecks: [new TypeORMHealthCheckStrategy()],
    },
};
