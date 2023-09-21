import {
  Administrator,
  AdministratorService,
  AuthService,
  AuthenticatedSession,
  Channel,
  ConfigService,
  ChannelService as CoreChannelService,
  CurrencyCode,
  EmailAddressConflictError,
  ErrorResult,
  EventBus,
  InternalServerError,
  LanguageCode,
  RequestContext,
  RequestContextService,
  RoleService,
  SellerService,
  ShippingMethod,
  ShippingMethodService,
  StockLocationService,
  TaxSetting,
  TransactionalConnection,
  defaultShippingCalculator,
  isGraphQlErrorResult,
  manualFulfillmentHandler
} from '@gseller/core';

import { ContextStrategy } from './context-auth-strategy';
import { CreateShopAdministratorInput } from '@gseller/common/lib/generated-types';
import { CreateShopEvent } from '../../../event-bus';
import { CurrentUser } from '@gseller/common/lib/generated-shop-types';
import { Injectable } from '@nestjs/common';
import { ResponseHeaderMiddleware } from './middleware';
import { Seller } from '@gseller/core/dist/entity/seller/seller.entity';
import { ShopNameConflictError } from '../../shared/graphql.errors';
import { permissions as customPermissions } from '../../../config/custom-permissions';
import { multivendorShippingEligibilityChecker } from './config/shipping-eligibility-checker';
import { normalizeString } from '@gseller/common/lib/normalize-string';

@Injectable()
export class StoreRegistryService {

  constructor(
    private connection: TransactionalConnection,
    private administratorService: AdministratorService,
    private sellerService: SellerService,
    private roleService: RoleService,
    private channelService: CoreChannelService,
    private shippingMethodService: ShippingMethodService,
    private configService: ConfigService,
    private contextStrategy: ContextStrategy,
    private eventBus: EventBus,
    private authService: AuthService,
    private responseHeaderMiddleware: ResponseHeaderMiddleware,
    private requestContext: RequestContextService,
    private stockLocationService: StockLocationService
  ) { }


  async registerNewSeller(input: {
    brand: string;
    administrator: CreateShopAdministratorInput,
  }, context: any,
  ): Promise<CurrentUser | EmailAddressConflictError | ErrorResult | ShopNameConflictError> {

    const existsAdmin = await this.connection
      .rawConnection
      .getRepository(Administrator)
      .findOne({ where: { emailAddress: input.administrator.emailAddress } });

    if (existsAdmin) return new EmailAddressConflictError();

    const existsSeller = await this.connection
      .rawConnection
      .getRepository(Seller)
      .findOne({ where: { name: input.brand } });

    if (existsSeller) return new ShopNameConflictError();

    const ctx = await this.contextStrategy.createRequestContext();
    const { channel, administrator } = await this.createSellerChannelRoleAdmin(ctx, input);

    // await this.createSellerShippingMethod(ctx, input.brand, channel);

    const auth = await this.authService.createAuthenticatedSessionForUser(ctx, administrator.user, 'native');

    if (!auth) new InternalServerError('Could not create session for user');

    if (administrator instanceof Administrator && auth instanceof AuthenticatedSession) {

      const ctx = await this.requestContext.create({
        apiType: 'admin',
        channelOrToken: channel.token
      });

      // Create default shop layout
      this.eventBus.publish(
        new CreateShopEvent(
          ctx,
          this.getChannelCode(input.brand)
        ));

      context.res.setHeader('Vendure-Auth-Token', auth.token);
      context.res.setHeader('channel-token', auth.token);

      return {
        __typename: 'CurrentUser',
        id: administrator.user.id,
        identifier: administrator.user.identifier,
        channels: [
          {
            id: channel.id,
            token: channel.token,
            code: channel.code,
            permissions: administrator.user.roles[0].permissions,
          },
        ],
      };
    }

    return new EmailAddressConflictError();
  }

  async getChannel(ctx: RequestContext): Promise<Channel> {
    return this.channelService.getChannelFromToken(ctx.channel.token);
  }

  async checkShopNameAvailability(brand: string): Promise<boolean> {
    const exists = await this.connection
      .rawConnection
      .getRepository(Channel)
      .findOne({ where: { code: this.getChannelCode(brand) } });

    return !exists;
  }

  private async createSellerShippingMethod(ctx: RequestContext, shopName: string, sellerChannel: Channel) {

    const defaultChannel = await this.channelService.getDefaultChannel(ctx);

    const {
      shippingEligibilityCheckers,
      shippingCalculators,
      fulfillmentHandlers } = this.configService.shippingOptions;

    const shopCode = normalizeString(shopName, '-');

    const checker = shippingEligibilityCheckers.find((c) => c.code === multivendorShippingEligibilityChecker.code);

    const calculator = shippingCalculators.find((c) => c.code === defaultShippingCalculator.code);

    const fulfillmentHandler = fulfillmentHandlers.find((h) => h.code === manualFulfillmentHandler.code);

    if (!checker) {
      throw new InternalServerError('Could not find a suitable ShippingEligibilityChecker for the seller');
    }
    if (!calculator) {
      throw new InternalServerError('Could not find a suitable ShippingCalculator for the seller');
    }
    if (!fulfillmentHandler) {
      throw new InternalServerError('Could not find a suitable FulfillmentHandler for the seller');
    }
    const shippingMethod = await this.shippingMethodService.create(ctx, {
      code: `${shopCode}-shipping`,
      checker: {
        code: checker.code,
        arguments: [],
      },
      calculator: {
        code: calculator.code,
        arguments: [
          { name: 'rate', value: '500' },
          { name: 'includesTax', value: TaxSetting.auto },
          { name: 'taxRate', value: '20' },
        ],
      },
      fulfillmentHandler: fulfillmentHandler.code,
      translations: [
        {
          languageCode: defaultChannel.defaultLanguageCode,
          name: `Standard Shipping for ${shopName}`,
        },
      ],
    });

    await this.channelService.assignToChannels(ctx, ShippingMethod, shippingMethod.id, [sellerChannel.id]);
  }

  private async createSellerChannelRoleAdmin(
    ctx: RequestContext,
    input: { brand: string; administrator: CreateShopAdministratorInput },
  ) {

    const defaultChannel = await this.channelService.getDefaultChannel(ctx);
    const shopCode = this.getChannelCode(input.brand);
    const accountId = Math.random().toString(30).substring(3);

    const seller = await this.sellerService.create(ctx, {
      name: input.brand,
      customFields: {
        connectedAccountId: accountId,
      },
    });

    const channel = await this.channelService.create(ctx, {
      code: shopCode,
      sellerId: seller.id,
      token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      currencyCode: CurrencyCode.BRL,
      defaultLanguageCode: LanguageCode.pt_BR,
      pricesIncludeTax: defaultChannel.pricesIncludeTax,
      defaultShippingZoneId: defaultChannel.defaultShippingZone.id,
      defaultTaxZoneId: defaultChannel.defaultTaxZone.id,
    });

    if (isGraphQlErrorResult(channel)) {
      throw new InternalServerError('Could not create seller channel');
    }

    const superAdminRole = await this.roleService.getSuperAdminRole(ctx);
    await this.roleService.assignRoleToChannel(ctx, superAdminRole.id, channel.id);

    const role = await this.roleService.create(ctx, {
      code: `${shopCode}-admin`,
      channelIds: [channel.id],
      description: `Administrator of ${input.brand}`,
      permissions: [...customPermissions],
    });

    const administrator = await this.administratorService.create(ctx, {
      firstName: input.administrator.firstName,
      lastName: input.administrator.lastName,
      emailAddress: input.administrator.emailAddress,
      password: input.administrator.password,
      roleIds: [role.id],
      customFields: {
        connectedAccountId: accountId,
      },
    });

    await this.createStockLocation(ctx, channel);

    return {
      administrator,
      channel,
    };
  }

  private async createStockLocation(ctx: RequestContext, channel: Channel) {
    const stockLocation = await this.stockLocationService.create(ctx, {
      code: `${channel.code}-stock`,
      name: `${channel.code} Stock`,
      description: `The default stock location for ${channel.code}, created automatically by GSeller in ${new Date().getFullYear()}`,
    });

    return this.stockLocationService.assignStockLocationsToChannel(ctx, {
      channelId: channel.id,
      stockLocationIds: [stockLocation.id],
    });
  }


  private getChannelCode(shopName: string) {
    return normalizeString(shopName, '-');
  }

}
