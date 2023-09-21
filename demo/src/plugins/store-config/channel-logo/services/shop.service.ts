import {
  AssetService,
  Channel,
  ChannelService,
  RequestContext,
  TransactionalConnection,
} from "@gseller/core";

import { Injectable } from "@nestjs/common";
import { LogoDoesExistError } from "../common/graphql.error";

@Injectable()
export class ChannelDetailsService {
  constructor(
    private assetService: AssetService,
    private connection: TransactionalConnection
  ) { }

  async getChannel(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      throw new Error(`No channel found`);
    }

    const { customFieldsLogoid } = await this.connection
      .rawConnection
      .getRepository(Channel)
      .createQueryBuilder("channel")
      .select([
        'channel.customFieldsLogoid as "customFieldsLogoid"',
      ])
      .where("channel.id = :id", { id: channel.id })
      .getRawOne();


    const asset = await this.assetService.findOne(ctx, customFieldsLogoid as string);

    if (!asset) {
      return new LogoDoesExistError();
    }

    return {
      __typename: "Asset",
      ...asset,
    };
  }
}
