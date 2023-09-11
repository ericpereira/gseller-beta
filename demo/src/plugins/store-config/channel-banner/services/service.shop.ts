import { Injectable } from "@nestjs/common";
import {
  Asset,
  AssetService,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import { ChannelBanner } from "../entities/channel-banner.entity";

@Injectable()
export class ChannelBannerShopService {
  constructor(private connection: TransactionalConnection) {}

  async channelBanners(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      return;
    }

    const channelBanners = await this.connection.rawConnection
      .getRepository(ChannelBanner)
      .find({
        where: {
          channel: {
            id: channel.id,
          },
        },
      });

    const channelBannersWithAsset = channelBanners.map(async (item) => {
      const asset = await this.connection.rawConnection
        .getRepository(Asset)
        .findOne({
          where: {
            id: item.asset.id,
          },
        });

      return {
        ...item,
        asset,
      };
    });

    const channelBannersWithAssetResolved = await Promise.all(
      channelBannersWithAsset
    );

    return channelBannersWithAssetResolved;
  }
}
