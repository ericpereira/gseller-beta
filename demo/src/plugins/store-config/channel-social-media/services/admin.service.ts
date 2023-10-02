import {
  CreateChannelSocialMediaInput,
  UpdateChannelSocialMediaInput,
} from "@ericpereiraglobalsys/common/lib/generated-types";
import { FindOneOptions, IsNull, UpdateResult } from "typeorm";
import { ID, RequestContext, TransactionalConnection } from "@ericpereiraglobalsys/core";
import {
  SocialMediaAlreadyRegisteredError,
  SocialMediaNotFoundError,
} from "../common/graphql.errors";

import { ChannelSocialMedia } from "../entities/social-media.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChannelSocialMediaService {
  constructor(private connection: TransactionalConnection) {}

  async create(ctx: RequestContext, input: CreateChannelSocialMediaInput) {
    const { channel } = ctx;

    const hasRegister = await this.connection
      .getRepository(ctx, ChannelSocialMedia)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          nome: input.nome,
          deletedAt: IsNull(),
        },
      } as FindOneOptions);

    if (hasRegister) {
      return new SocialMediaAlreadyRegisteredError();
    }

    const channelSocialMedia = new ChannelSocialMedia({
      ...input,
      channel: channel,
    });
    const register = await this.connection
      .getRepository(ctx, ChannelSocialMedia)
      .save(channelSocialMedia);

    return {
      __typename: "ChannelSocialMedia",
      ...register,
      channel,
    };
  }

  async update(ctx: RequestContext, input: UpdateChannelSocialMediaInput) {
    const { link, nome } = input;

    const options: FindOneOptions = {
      where: {
        nome,
      },
    };

    const existingSocialMedia = await this.connection.rawConnection
      .getRepository(ChannelSocialMedia)
      .findOne(options);

    if (!existingSocialMedia) {
      return new SocialMediaNotFoundError();
    }

    const { raw }: UpdateResult = await this.connection.rawConnection
      .createQueryBuilder()
      .update(ChannelSocialMedia)
      .set({
        ...input,
      })
      .where("id = :id", { id: existingSocialMedia.id as ID })
      .returning("*")
      .execute();

    return {
      __typename: "ChannelSocialMedia",
      ...raw[0],
      channel: ctx.channel,
    };
  }

  async delete(ctx: RequestContext, id: string): Promise<boolean> {
    const options: FindOneOptions = {
      where: {
        id,
        deletedAt: IsNull(),
      },
    };

    const existingSocialMedia = await this.connection.rawConnection
      .getRepository(ChannelSocialMedia)
      .findOne(options);

    if (!existingSocialMedia) {
      return false;
    }

    existingSocialMedia.deletedAt = new Date();

    const updatedSocialMedia = await this.connection.rawConnection
      .getRepository(ChannelSocialMedia)
      .update(existingSocialMedia.id as ID, {
        deletedAt: new Date(),
      });

    return updatedSocialMedia !== null;
  }

  async getChannelSocialMedia(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      throw new Error(`No channel found`);
    }

    const socialMedia = await this.connection.rawConnection
      .getRepository(ChannelSocialMedia)
      .find({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    return {
      __typename: "ChannelSocialMediaList",
      items: [...socialMedia]!,
      totalItems: socialMedia?.length,
    };
  }
}
