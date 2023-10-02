import {
  ChannelService,
  CollectionService,
  Country,
  CountryService,
  CurrencyCode,
  Facet,
  FacetService,
  FacetValueService,
  GlobalSettingsService,
  LanguageCode,
  Logger,
  RequestContext,
  TaxCategory,
  TaxCategoryService,
  TaxRate,
  TaxRateService,
  TransactionalConnection,
  Zone,
  ZoneService,
} from '@ericpereiraglobalsys/core';

import { ContextStrategy } from '../context-auth-strategy';
import { Injectable } from '@nestjs/common';
import { initialData } from '../common/initial.data';

@Injectable()
export class PopulateSettings {
  constructor(
    private connection: TransactionalConnection,
    private channelService: ChannelService,
    private globalSettingsService: GlobalSettingsService,
    private zoneService: ZoneService,
    private taxCategoryService: TaxCategoryService,
    private countryService: CountryService,
    private contextStrategy: ContextStrategy,
    private facetService: FacetService,
    private facetValueService: FacetValueService,
    private collectionService: CollectionService,
    private taxRateService: TaxRateService,
  ) {}

  async initialDataConfig(): Promise<void> {
    try {
      const ctx = await this.contextStrategy.createRequestContext();

      await this.createTaxCategory(ctx);
      await this.createCountries(ctx);
      await this.createZone(ctx);
      await this.createFacet(ctx);
      await this.createTaxRates(ctx);

      //step 5 - Configure global settings for languages
      this.globalSettingsService.updateSettings(ctx, {
        availableLanguages: [...Object.values(LanguageCode)],
      });

      //step 6 - Configure default channel
      this.configurationDefaultChannel(ctx);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  private async createTaxCategory(ctx: RequestContext): Promise<TaxCategory | undefined> {
    Logger.info(`Creating tax category`, 'PopulateSettings');

    const taxCategory = await this.taxCategoryService.findAll(ctx);

    if (taxCategory.totalItems > 0) return;

    return await this.taxCategoryService.create(ctx, {
      name: 'default',
      isDefault: true,
    });
  }

  private async createCountries(ctx: RequestContext) {
    const promises = initialData.countries.map(async (country) => {
      const isAlreadyRegistered = await this.connection.rawConnection
        .getRepository(Country)
        .createQueryBuilder('country')
        .where('country.code = :code', { code: country.code })
        .getOne();

      if (isAlreadyRegistered) return;

      Logger.info(`Creating country ${country.name}`, 'PopulateSettings');

      return await this.countryService.create(ctx, {
        code: country.code,
        translations: [
          {
            languageCode: LanguageCode.pt_BR,
            name: country.name,
          },
        ],
        enabled: true,
      });
    });

    const results = await Promise.all(promises);

    return results;
  }

  private async createZone(ctx: RequestContext): Promise<Array<Zone | undefined>> {
    const zones = initialData.countries.map((country) => country.zone);
    const distinctZones = [...new Set(zones)];

    const promises = distinctZones.map(async (name) => {
      const hasRegister = await this.connection.rawConnection
        .getRepository(Zone)
        .createQueryBuilder('zone')
        .where('zone.name = :name', { name })
        .getOne();

      if (hasRegister) return;

      Logger.info(`Creating zone ${name}`, 'PopulateSettings');

      const findAllCountries = initialData.countries
        .map((country) => (country.zone === name ? country.code : null))
        .filter((item) => item !== null);

      const countries = await this.countryService.findAll(ctx, {
        filter: {
          code: {
            in: [...(findAllCountries as string[])],
          },
        },
      });

      return this.zoneService.create(ctx, {
        name: name,
        memberIds: [...countries.items.map((item) => item.id)],
      });
    });

    const results = await Promise.all(promises);

    return results;
  }

  private async configurationDefaultChannel(ctx: RequestContext): Promise<void> {
    const zone = await this.zoneService.findAll(ctx);
    const zoneExist = zone.items.find((item) => item.name === 'Americas');
    const defaultChannel = await this.channelService.findAll(ctx);

    if (!zoneExist) throw new Error('Zone not found');

    Logger.info('Configuring default channel', 'PopulateSettings');

    await this.channelService.update(ctx, {
      id: defaultChannel.items[0].id,
      defaultTaxZoneId: zoneExist!.id,
      currencyCode: CurrencyCode.BRL,
      pricesIncludeTax: true,
      defaultShippingZoneId: zoneExist!.id,
    });

    Logger.info('Configuring default channel done', 'PopulateSettings');
  }

  private async createFacet(ctx: RequestContext) {
    const promises = initialData.facets.map(async (facet) => {
      const hasRegisterFacet = await this.connection.rawConnection
        .getRepository(Facet)
        .createQueryBuilder('facet')
        .where('facet.code = :code', { code: facet.name.toLowerCase() })
        .getOne();

      if (hasRegisterFacet) return;

      Logger.info(`Creating facet ${facet.name}`, 'PopulateSettings');

      const newFacet = await this.facetService.create(ctx, {
        isPrivate: false,
        code: facet.name.toLowerCase(),
        translations: [
          {
            languageCode: 'pt_BR' as any,
            name: facet.name,
          },
        ],
      });

      return facet.values.map(async (value) => {
        return this.facetValueService.create(ctx, newFacet, {
          facetId: newFacet.id,
          code: value.toLowerCase().split(' ').join('-'),
          translations: [
            {
              name: value.toLowerCase(),
              languageCode: ctx.languageCode,
            },
          ],
        });
      });
    });

    return Promise.all(promises);
  }

  private async createTaxRates(ctx: RequestContext) {
    const findAllTaxRates = initialData.taxRates;

    const promises = findAllTaxRates.map(async (taxRate) => {
      const hasRegisterTaxRate = await this.connection.rawConnection
        .getRepository(TaxRate)
        .createQueryBuilder('taxRate')
        .where('taxRate.name = :name', { name: taxRate.name })
        .getOne();

      if (hasRegisterTaxRate) return;

      const taxCategory = await this.findTaxCategoryDefault(ctx);

      if (!taxCategory) throw new Error('Tax category not found');

      Logger.info(`Creating taxRate ${taxRate.name}`, 'PopulateSettings');

      (await this.zoneService.findAll(ctx)).items.map(async (zone) => {
        await this.taxRateService.create(ctx, {
          name: taxRate.name,
          enabled: true,
          value: 0,
          categoryId: taxCategory?.id,
          zoneId: zone.id,
        });
      });
    });

    return Promise.all(promises);
  }

  private async findTaxCategoryDefault(ctx: RequestContext): Promise<TaxCategory | undefined> {
    const taxCategory = await this.taxCategoryService.findAll(ctx);
    return taxCategory.items.find((item) => item.isDefault);
  }
}
