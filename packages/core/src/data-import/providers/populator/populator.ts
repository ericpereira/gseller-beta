import { Injectable } from '@nestjs/common';
import { ConfigurableOperationInput } from '@ericpereiraglobalsys/common/lib/generated-types';
import { normalizeString } from '@ericpereiraglobalsys/common/lib/normalize-string';
import { notNullOrUndefined } from '@ericpereiraglobalsys/common/lib/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
import {
    ConfigService,
    Logger,
} from '../../../config';
import { TransactionalConnection } from '../../../connection/index';
import { Channel, User } from '../../../entity';
import {
    RequestContextService,
    RoleService,
} from '../../../service';
import { ChannelService } from '../../../service/services/channel.service';
import { CountryService } from '../../../service/services/country.service';
import { SearchService } from '../../../service/services/search.service';
import { ZoneService } from '../../../service/services/zone.service';
import {
    CountryDefinition,
    InitialData,
    RoleDefinition,
    ZoneMap,
} from '../../types';
import { AssetImporter } from '../asset-importer/asset-importer';

/**
 * @description
 * Responsible for populating the database with {@link InitialData}, i.e. non-product data such as countries, tax rates,
 * shipping methods, payment methods & roles.
 *
 * @docsCategory import-export
 */
@Injectable()
export class Populator {
    /** @internal */
    constructor(
        private countryService: CountryService,
        private zoneService: ZoneService,
        private channelService: ChannelService,
        private searchService: SearchService,
        private assetImporter: AssetImporter,
        private roleService: RoleService,
        private configService: ConfigService,
        private connection: TransactionalConnection,
        private requestContextService: RequestContextService,
    ) {}

    /**
     * @description
     * Should be run *before* populating the products, so that there are TaxRates by which
     * product prices can be set. If the `channel` argument is set, then any {@link ChannelAware}
     * entities will be assigned to that Channel.
     */
    async populateInitialData(data: InitialData, channel?: Channel) {
        const ctx = await this.createRequestContext(data, channel);
        let zoneMap: ZoneMap;
        try {
            zoneMap = await this.populateCountries(ctx, data.countries);
        } catch (e: any) {
            Logger.error('Could not populate countries');
            Logger.error(e, 'populator', e.stack);
            throw e;
        }
        try {
            await this.setChannelDefaults(zoneMap, data, ctx.channel);
        } catch (e: any) {
            Logger.error('Could not set channel defaults');
            Logger.error(e, 'populator', e.stack);
        }
        try {
            await this.populateRoles(ctx, data.roles);
        } catch (e: any) {
            Logger.error('Could not populate roles');
            Logger.error(e, 'populator', e.stack);
        }
    }

    private async createRequestContext(data: InitialData, channel?: Channel) {
        const { superadminCredentials } = this.configService.authOptions;
        const superAdminUser = await this.connection.rawConnection.getRepository(User).findOne({
            where: {
                identifier: superadminCredentials.identifier,
            },
        });
        const ctx = await this.requestContextService.create({
            user: superAdminUser ?? undefined,
            apiType: 'admin',
            languageCode: data.defaultLanguage,
            channelOrToken: channel ?? (await this.channelService.getDefaultChannel()),
        });
        return ctx;
    }

    private async setChannelDefaults(zoneMap: ZoneMap, data: InitialData, channel: Channel) {
        const defaultZone = zoneMap.get(data.defaultZone);
        if (!defaultZone) {
            throw new Error(
                `The defaultZone (${data.defaultZone}) did not match any existing or created zone names`,
            );
        }
        const defaultZoneId = defaultZone.entity.id;
        await this.channelService.update(RequestContext.empty(), {
            id: channel.id,
            defaultTaxZoneId: defaultZoneId,
            defaultShippingZoneId: defaultZoneId,
        });
    }

    private async populateCountries(ctx: RequestContext, countries: CountryDefinition[]): Promise<ZoneMap> {
        const zoneMap: ZoneMap = new Map();
        const existingZones = await this.zoneService.getAllWithMembers(ctx);
        for (const zone of existingZones) {
            zoneMap.set(zone.name, { entity: zone, members: zone.members.map(m => m.id) });
        }
        for (const { name, code, zone } of countries) {
            const countryEntity = await this.countryService.create(ctx, {
                code,
                enabled: true,
                translations: [{ languageCode: ctx.languageCode, name }],
            });

            let zoneItem = zoneMap.get(zone);
            if (!zoneItem) {
                const zoneEntity = await this.zoneService.create(ctx, { name: zone });
                zoneItem = { entity: zoneEntity, members: [] };
                zoneMap.set(zone, zoneItem);
            }
            if (!zoneItem.members.includes(countryEntity.id)) {
                zoneItem.members.push(countryEntity.id);
            }
        }

        // add the countries to the respective zones
        for (const zoneItem of zoneMap.values()) {
            await this.zoneService.addMembersToZone(ctx, {
                zoneId: zoneItem.entity.id,
                memberIds: zoneItem.members,
            });
        }

        return zoneMap;
    }

    private async populateRoles(ctx: RequestContext, roles?: RoleDefinition[]) {
        if (!roles) {
            return;
        }
        for (const roleDef of roles) {
            await this.roleService.create(ctx, roleDef);
        }
    }
}
