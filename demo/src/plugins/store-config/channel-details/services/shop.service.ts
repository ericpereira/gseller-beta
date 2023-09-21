import {
  Asset,
  Channel,
  RequestContext,
  TransactionalConnection
} from "@gseller/core";

import { ChannelAddress } from "../../channel-address/entities/channel-address.entity";
import { ChannelBanner } from "../../channel-banner/entities/channel-banner.entity";
import { ChannelNotFoundError } from "../common/graphql.errors";
import { Injectable } from "@nestjs/common";

//temp
@Injectable()
export class ChannelDetailsService {
  constructor(private connection: TransactionalConnection) { }

  async getChannel(ctx: RequestContext) {

    const { channel } = ctx;

    console.log(channel.code)

    if (!channel) {
      return new ChannelNotFoundError()
    }

    const channelDetails = this.connection
      .rawConnection
      .getRepository(Channel)
      .createQueryBuilder("channel")
      .select([
        'channel.createdAt as "createdAt"',
        'channel.updatedAt as "updatedAt"',
        'channel.code as "code"',
        'channel.token as "token"',
        'channel.description as "description"',
        'channel.defaultLanguageCode as "defaultLanguageCode"',
        'channel.availableLanguageCodes as "availableLanguageCodes"',
        'channel.defaultCurrencyCode as "defaultCurrencyCode"',
        'channel.availableCurrencyCodes as "availableCurrencyCodes"',
        'channel.trackInventory as "trackInventory"',
        'channel.outOfStockThreshold as "outOfStockThreshold"',
        'channel.pricesIncludeTax as "pricesIncludeTax"',
        'channel.id as "channelId"',
        'channel.sellerId as "sellerId"',
        'channel.defaultTaxZoneId as "defaultTaxZoneId"',
        'channel.defaultShippingZoneId as "defaultShippingZoneId"',
        'channel.customFieldsLogoid as "customFieldsLogoid"',
      ])
      .where("channel.id = :id", { id: channel.id })

      // select banner
      .addSelect((subQuery) => {
        return subQuery
          .select('json_build_object(\'banners\', json_agg(banner.*), \'asset\', json_agg(asset.*))')
          .from(ChannelBanner, 'banner')
          .where('banner.channel.id = channel.id')
          .leftJoin(Asset, 'asset', 'banner.assetId = asset.id')
          .groupBy('banner.assetId')
      }, 'banners')

      // select Address 
      .addSelect((subQuery) => {
        return subQuery
          .select('json_agg(address.*) ')
          .from(ChannelAddress, 'address')
          .where('address.channel.id = channel.id')
          .groupBy('address.id')
      }, 'addresses')


    const result: any = await channelDetails.getRawOne();

    console.log(result)

    return {
      channel: channelDetails,
    };
  }
}
