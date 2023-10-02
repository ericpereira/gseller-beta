import {
  ChannelService,
  RequestContext,
  TransactionalConnection,
} from "@ericpereiraglobalsys/core";
import { IsNull } from "typeorm";

import {
  AddressNotFoundError,
  ChannelNotFoundError,
} from "../common/graphql.errors";
import { ChannelAddress } from "../entities/channel-address.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChannelAddressServiceShop {
  constructor(
    private connection: TransactionalConnection,
    private channelService: ChannelService
  ) {}

  async getChannelAddress(ctx: RequestContext): Promise<any> {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const channelAddress = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .find({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
          distributionCenter: false,
        },
      });

    if (!channelAddress) {
      return new AddressNotFoundError();
    }

    return {
      __typename: "ChannelAddressResponse",
      address: channelAddress,
      channel,
    };
  }

  async getActiveChannelAddress(ctx: RequestContext): Promise<any> {
    const channel = await this.channelService.getChannelFromToken(
      ctx.channel.token
    );

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const channelAddress = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .find({
        where: {
          channel: {
            id: channel.id,
          },
        },
      });

    if (!channelAddress) {
      return new AddressNotFoundError();
    }

    return {
      __typename: "ChannelAddressResponse",
      address: channelAddress,
      channel,
    };
  }
}
