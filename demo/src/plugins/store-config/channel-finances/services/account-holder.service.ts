import {
  AccountHolderAlreadyExistsError,
  AccountHolderNotFoundError,
  BankAccountNotFoundError,
  CannotDeleteAccountHolderError,
  ChannelNotFoundError,
} from "../common/graphql.errors";
import {
  AccountHolderInput,
  UpdateAccountHolderInput,
} from "@vendure/common/lib/generated-types";
import { IsNull, UpdateResult } from "typeorm";
import { RequestContext, TransactionalConnection } from "@vendure/core";

import { AccountHolder } from "../entities/account.holder.entity";
import { ChannelBankAccount } from "../entities/bank-account.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccountHolderService {
  constructor(private connection: TransactionalConnection) {}

  async create(ctx: RequestContext, input: AccountHolderInput) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingAccountHolder = await this.connection.rawConnection
      .getRepository(AccountHolder)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    if (existingAccountHolder) {
      return new AccountHolderAlreadyExistsError();
    }

    const accountHolder = await this.connection.rawConnection
      .getRepository(AccountHolder)
      .save({
        channel,
        ...input,
        ...(!input.legalName && { legalName: `${channel.code}` }),
      });

    return {
      __typename: "AccountHolder",
      ...accountHolder,
      channel: channel,
    };
  }

  async update(ctx: RequestContext, input: UpdateAccountHolderInput) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingAccountHolder = await this.connection.rawConnection
      .getRepository(AccountHolder)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    if (!existingAccountHolder) {
      return new AccountHolderNotFoundError();
    }

    const { raw }: UpdateResult = await this.connection.rawConnection
      .createQueryBuilder()
      .update(AccountHolder)
      .set({
        ...input,
      })
      .where("id = :id", { id: existingAccountHolder.id })
      .returning("*")
      .execute();

    return {
      __typename: "AccountHolder",
      ...raw[0],
      channel: channel,
    };
  }

  async delete(ctx: RequestContext, id: string) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingAccountHolder = await this.connection.rawConnection
      .getRepository(AccountHolder)
      .findOne({
        where: {
          id,
          deletedAt: IsNull(),
          channel: {
            id: channel.id,
          },
        },
      });

    if (!existingAccountHolder) {
      return new BankAccountNotFoundError();
    }

    const hasRelationship = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .findOne({
        where: {
          deletedAt: IsNull(),
          accountHolder: {
            id: existingAccountHolder.id,
          },
        },
      });

    if (hasRelationship) {
      return new CannotDeleteAccountHolderError();
    }

    const { affected }: UpdateResult = await this.connection.rawConnection
      .createQueryBuilder()
      .update(AccountHolder)
      .set({
        deletedAt: new Date(),
      })
      .where("id = :id", { id: existingAccountHolder.id })
      .returning("*")
      .execute();

    return {
      __typename: "success",
      success: affected !== undefined && affected > 0,
    };
  }

  async findOne(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingAccountHolder = await this.connection.rawConnection
      .getRepository(AccountHolder)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    if (!existingAccountHolder) {
      return new BankAccountNotFoundError();
    }

    return {
      __typename: "AccountHolder",
      ...existingAccountHolder,
      channel: channel,
    };
  }
}
