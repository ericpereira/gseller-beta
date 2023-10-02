import {
  AccountHolderNotFoundError,
  BankAccountNotFoundError,
  ChannelNotFoundError,
  DocumentNumberConflictError,
} from "../common/graphql.errors";
import {
  Administrator,
  Channel,
  ChannelService,
  EventBus,
  PaymentMethod,
  PaymentMethodService,
  RequestContext,
  RequestContextService,
  TransactionalConnection,
} from "@ericpereiraglobalsys/core";

import { AccountHolder } from "../entities/account.holder.entity";
import { BankAccountEvent } from "../../../../event-bus/events/bank-account-event";
import { ChannelBankAccount } from "../entities/bank-account.entity";
import { ContextStrategy } from "../context-auth-strategy";
import { Injectable } from "@nestjs/common";
import { IsNull } from "typeorm";
import { PaymentAccountInput } from "@ericpereiraglobalsys/common/lib/generated-types";
import { Seller } from "@ericpereiraglobalsys/core/dist/entity/seller/seller.entity";

@Injectable()
export class FinancesService {
  constructor(
    private connection: TransactionalConnection,
    private eventBus: EventBus,
    private channelService: ChannelService,
    private paymentMethodService: PaymentMethodService,
    private contextStrategy: ContextStrategy,
  ) { }

  async create(ctx: RequestContext, input: Omit<PaymentAccountInput, "id">) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingBankAccount = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    if (existingBankAccount) {
      return new DocumentNumberConflictError();
    }

    const findAccountHolder = await this.connection.rawConnection
      .getRepository(AccountHolder)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    if (!findAccountHolder) {
      return new AccountHolderNotFoundError();
    }

    const { raw } = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .createQueryBuilder()
      .insert()
      .into(ChannelBankAccount)
      .values({
        ...input,
        channel,
        accountHolder: findAccountHolder,
      })
      .returning("*")
      .execute();

    const administrator = await this.getAdministrator(channel);

    if (administrator instanceof Administrator) {
      this.eventBus.publish(
        new BankAccountEvent(ctx, {
          id: raw[0].id,
          code: channel.token,
          description: `bank account of shop ${channel.code}`,
          name: administrator.firstName + " " + administrator.lastName,
          document: findAccountHolder.documentNumber as string,
          email: administrator.emailAddress,
          type: "individual", //TO DO: get dynamically
          defaultBankAccount: {
            bank: raw[0].bankCode,
            ...raw[0],
          },
          channel,
        })
      );
    }

    return {
      __typename: "ChannelPaymentAccount",
      ...raw[0],
      channel,
    };
  }

  async update(ctx: RequestContext, input: Omit<PaymentAccountInput, "id">) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingBankAccount = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    if (!existingBankAccount) {
      return new BankAccountNotFoundError();
    }

    const findAccountHolder = await this.connection.rawConnection
      .getRepository(AccountHolder)
      .findOne({
        where: {
          channel: {
            id: channel.id,
          },
          deletedAt: IsNull(),
        },
      });

    if (!findAccountHolder) {
      return new AccountHolderNotFoundError();
    }

    const { raw } = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .update(existingBankAccount.id, {
        ...input,
      });


    const administrator = await this.getAdministrator(channel);

    if (administrator instanceof Administrator) {
      this.eventBus.publish(
        new BankAccountEvent(ctx, {
          id: raw[0].id,
          code: channel.token,
          description: `bank account of shop ${channel.code}`,
          name: administrator.firstName + " " + administrator.lastName,
          document: findAccountHolder.documentNumber as string,
          email: administrator.emailAddress,
          type: "individual", //TO DO: get dynamically
          defaultBankAccount: {
            bank: raw[0].bankCode,
            ...raw[0],
          },
          channel,
        })
      );
    }

    return {
      __typename: "ChannelPaymentAccount",
      ...raw[0],
      channel: channel,
    };
  }

  async delete(ctx: RequestContext, id: string) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingBankAccount = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .findOne({
        where: {
          id,
          deletedAt: IsNull(),
          channel: {
            id: channel.id,
          },
        },
      });

    if (!existingBankAccount) {
      return new BankAccountNotFoundError();
    }

    const bankAccount = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .update(id, {
        deletedAt: new Date(),
      });

    return {
      __typename: "ChannelPaymentAccount",
      ...existingBankAccount,
    };
  }

  async findOne(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingBankAccount = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .createQueryBuilder("bankAccount")
      .leftJoinAndSelect("bankAccount.accountHolder", "accountHolder")
      .where("bankAccount.channelId = :channelId", {
        channelId: channel.id as string,
      })
      .andWhere("bankAccount.deletedAt IS NULL")
      .getOne();

    if (!existingBankAccount) {
      return new BankAccountNotFoundError();
    }

    return {
      __typename: "ChannelPaymentAccount",
      ...existingBankAccount,
      channel: channel,
    };
  }

  async findAll(ctx: RequestContext) {
    const { channel } = ctx;

    if (!channel) {
      return new ChannelNotFoundError();
    }

    const existingBankAccount = await this.connection.rawConnection
      .getRepository(ChannelBankAccount)
      .createQueryBuilder("bankAccount")
      .leftJoinAndSelect("bankAccount.accountHolder", "accountHolder")
      .where("bankAccount.channelId = :channelId", {
        channelId: channel.id as string,
      })
      .andWhere("bankAccount.deletedAt IS NULL")
      .getMany();

    if (!existingBankAccount) {
      new BankAccountNotFoundError();
    }

    return existingBankAccount.map((bankAccount) => ({
      __typename: "ChannelPaymentAccount",
      ...bankAccount,
      channel: channel,
    }));
  }

  private async getAdministrator(
    channel: Channel
  ): Promise<Administrator | ChannelNotFoundError | null> {
    const { sellerId } = await this.channelService.getChannelFromToken(
      channel.token
    );

    const seller = await this.connection.rawConnection
      .getRepository(Seller)
      .findOne({
        where: {
          id: sellerId,
          deletedAt: IsNull(),
        },
      });

    if (!seller) {
      return new ChannelNotFoundError();
    }

    const { connectedAccountId }: any = seller.customFields;

    const administrator = await this.connection.rawConnection
      .getRepository(Administrator)
      .findOne({
        where: {
          customFields: {
            connectedAccountId,
          },
        },
      });

    return administrator;
  }

  async getPaymentMethodService(channel: Channel) {
    const ctx: RequestContext = await this.contextStrategy.createRequestContext(
      channel
    );
    const paymentMethodHandlers =
      this.paymentMethodService.getPaymentMethodHandlers(ctx);

    return paymentMethodHandlers.find((pm) => pm.code === "pagarme");
  }

}
