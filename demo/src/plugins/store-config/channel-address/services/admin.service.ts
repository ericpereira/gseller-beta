import { Injectable } from "@nestjs/common";
import {
  ChannelService,
  EventBus,
  RequestContext,
  TransactionalConnection,
} from "@ericpereiraglobalsys/core";
import { ChannelAddressInput } from "@ericpereiraglobalsys/common/lib/generated-types";
import { IsNull, UpdateResult } from "typeorm";

import {
  AddressAlreadyRegisteredError,
  AddressNotFoundError,
  ChannelNotFoundError,
  DistributionCenterAlreadyRegisteredError,
} from "../common/graphql.errors";

import { ChannelAddress } from "../entities/channel-address.entity";
import { RegisterDistribuitionCenterEvent } from "../../../../event-bus/events/register-distribuition-center-event";

@Injectable()
export class ChannelAddressServiceAdmin {
  constructor(
    private connection: TransactionalConnection,
    private channelService: ChannelService,
    private eventBus: EventBus
  ) {}

  async registerChannelAddress(
    ctx: RequestContext,
    input: ChannelAddressInput
  ) {
    const { channel } = ctx;

    const isChannelExist = await this.channelService.findOne(ctx, channel.id);

    if (!isChannelExist) {
      return new ChannelNotFoundError();
    }

    const isChannelAddressExist = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          ...(input.distributionCenter
            ? { distributionCenter: true }
            : { distributionCenter: false }), // if distributionCenter is true then check for distributionCenter: true
          deletedAt: IsNull(),
        },
      });

    if (isChannelAddressExist) {
      switch (input.distributionCenter) {
        case true:
          return new AddressAlreadyRegisteredError();
        case false:
          return new DistributionCenterAlreadyRegisteredError();
        default:
          break;
      }
    }

    const channelAddress = new ChannelAddress({
      ...input,
      channel: isChannelExist,
    });

    const channelAddressSaved = await this.connection
      .getRepository(ctx, ChannelAddress)
      .save(channelAddress);

    if (input.distributionCenter)
      this.eventBus.publish(new RegisterDistribuitionCenterEvent(ctx));

    return {
      __typename: "ChannelAddress",
      ...channelAddressSaved,
    };
  }

  async updateChannelAddress(ctx: RequestContext, input: ChannelAddressInput) {
    return this.updateChannel(ctx, input, false);
  }

  async updateChannelDistributionCenter(
    ctx: RequestContext,
    input: ChannelAddressInput
  ) {
    return this.updateChannel(ctx, input, true);
  }

  async deleteChannelAddress(ctx: RequestContext, id: string) {
    const { channel } = ctx;

    const isChannelAddressExist = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .findOne({
        where: {
          id,
          channel: {
            id: channel.id,
          },
        },
      });

    if (!isChannelAddressExist) {
      return new AddressNotFoundError();
    }

    const isChannelAddressDeleted = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .update(id, {
        deletedAt: new Date(),
      });

    return {
      __typename: "Success",
      success: isChannelAddressDeleted ? true : false,
    };
  }

  async getChannelAddress(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      return new Error("Channel not found");
    }

    const channelAddress = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .findOne({
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
      __typename: "ChannelAddress",
      ...channelAddress,
      channel: channel,
    };
  }

  async getChannelDistributionCenter(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      return new Error("Channel not found");
    }

    const channelAddress = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          distributionCenter: true,
          deletedAt: IsNull(),
        },
      });

    if (!channelAddress) {
      return new AddressNotFoundError();
    }

    return {
      __typename: "ChannelAddress",
      ...channelAddress,
      channel: channel,
    };
  }

  private async updateChannel(
    ctx: RequestContext,
    input: ChannelAddressInput,
    distributionCenter: boolean
  ) {
    const { channel } = ctx;

    const isChannelAddressExist = await this.connection.rawConnection
      .getRepository(ChannelAddress)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          distributionCenter,
          deletedAt: IsNull(),
        },
      });

    if (!isChannelAddressExist) {
      return new ChannelNotFoundError();
    }

    const { raw }: UpdateResult = await this.connection.rawConnection
      .createQueryBuilder()
      .update(ChannelAddress)
      .set({
        ...input,
      })
      .where("id = :id", { id: isChannelAddressExist.id })
      .returning("*")
      .execute();

    return {
      __typename: "ChannelAddress",
      ...raw[0],
    };
  }
}
