import {
  Asset,
  AssetService,
  RequestContext,
  TransactionalConnection,
  isGraphQlErrorResult,
} from "@ericpereiraglobalsys/core";
import {
  AssetNotDeletedError,
  BannerNotDeletedError,
  BannerNotFoundError,
  BannerNotUpdatedError,
  ChannelNotFoundError,
} from "../common/graphql.error";
import {
  CreateChannelBannerWithAssetIdInput,
  CreateChannelBannerWithAssetInput,
  UpdateChannelBanner,
} from "@ericpereiraglobalsys/common/lib/generated-types";

import { ChannelBanner } from "../entities/channel-banner.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChannelBannerAdminService {
  constructor(
    private connection: TransactionalConnection,
    private assetService: AssetService
  ) {}

  async getAllBanner(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    return this.connection.rawConnection.getRepository(ChannelBanner).find({
      where: {
        channel: {
          id: channel.id,
        },
      },
      order: {
        id: "DESC",
      },
      relations: ["asset", "channel"],
    });
  }

  async setChannelBanner(
    ctx: RequestContext,
    args: CreateChannelBannerWithAssetInput
  ) {
    const { channel } = ctx;

    if (!channel) {
      return;
    }

    const asset = await this.uploadFile(ctx, args.asset);

    const { active, description, endAt, startAt, link, title } = args;

    const channelBannerCreated = await this.connection.rawConnection
      .getRepository(ChannelBanner)
      .save({
        active,
        description,
        ...(startAt && { startAt: new Date(startAt) }), //TO DO: check format of startAt
        link,
        title,
        ...(endAt && { endAt: new Date(endAt) }), //TO DO: check format of startAt
        channel,
        asset,
      });

    return channelBannerCreated;
  }

  async setChannelBannerAssetId(
    ctx: RequestContext,
    args: CreateChannelBannerWithAssetIdInput
  ) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const { active, description, endAt, startAt, link, title, assetId } = args;

    const assetExists = await this.assetService.findOne(ctx, assetId);

    if (!assetExists) {
      return new BannerNotFoundError();
    }

    const channelBannerCreated = await this.connection.rawConnection
      .getRepository(ChannelBanner)
      .save({
        active,
        description,
        ...(startAt && { startAt: new Date(startAt) }), //TO DO: check format of startAt
        link,
        title,
        ...(endAt && { endAt: new Date(endAt) }), //TO DO: check format of startAt
        channel,
        asset: assetExists,
      });

    return channelBannerCreated;
  }

  async updateChannelBanner(ctx: RequestContext, args: UpdateChannelBanner) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const { active, description, endAt, startAt, link, title, bannerId } = args;

    const channelBannerCreated = await this.connection.rawConnection
      .getRepository(ChannelBanner)
      .update(bannerId, {
        active,
        description,
        startAt,
        link,
        title,
        endAt,
        channel,
        ...(args.asset && { asset: await this.uploadFile(ctx, args.asset) }),
      });

    if (channelBannerCreated?.affected)
      return {
        __typename: "UpdatedSuccess",
        success: true,
      };

    return new BannerNotUpdatedError();
  }

  async deleteChannelBanner(ctx: RequestContext, bannerId: string) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const channelBanner = await this.connection.rawConnection
      .getRepository(ChannelBanner)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          id: bannerId,
        },
        relations: ["asset", "channel"],
      });

    if (!channelBanner) return new BannerNotFoundError();

    const assetId = channelBanner?.asset?.id;

    const deleteBannerResponse = await this.connection.rawConnection
      .getRepository(ChannelBanner)
      .delete(bannerId);

    if (!deleteBannerResponse.affected) return new BannerNotDeletedError();

    if (assetId) {
      const deleteAssetResponse = await this.connection.rawConnection
        .getRepository(Asset)
        .delete(assetId as string);

      if (!deleteAssetResponse.affected) return new AssetNotDeletedError();
    }

    return {
      __typename: "DeletedSuccess",
      success: true,
    };
  }

  private async uploadFile(ctx: RequestContext, assets: any) {
    // Create an Asset from the uploaded file
    const asset = await this.assetService.create(ctx, {
      file: assets,
      tags: ["banner"],
    });

    // Check to make sure there was no error when
    // creating the Asset
    if (isGraphQlErrorResult(asset)) {
      // MimeTypeError
      throw asset;
    }

    return asset;
  }
}
