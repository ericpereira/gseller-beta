import { Channel, VendureEntity } from "@vendure/core";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { AccountHolder } from "./account.holder.entity";
import { DeepPartial } from "@vendure/common/lib/shared-types";

@Entity()
class ChannelBankAccount extends VendureEntity {
  constructor(input?: DeepPartial<ChannelBankAccount>) {
    super(input);
  }
  @Column({ length: 3, comment: "Bank code must have a maximum 3 digits" })
  bankCode?: string;

  @Column({
    length: 4,
    comment: "Branch number must have a maximum of 4 characters",
  })
  branchNumber?: string;

  @Column({
    length: 1,
    comment: "Branch check digit must have a maximum of 1 numeric character",
  })
  branchCheckDigit?: string;

  @Column({
    length: 13,
    comment: "Account number must have a maximum of 13 numeric characters",
  })
  accountNumber: string;

  @Column({
    length: 2,
    comment: "Account check digit must have a maximum of 2 numeric characters",
  })
  accountCheckDigit: string;

  @Column({
    default: "conta_corrente",
    comment:
      "Account Type: conta_corrente, conta_poupanca, conta_corrente_conjunta, conta_poupanca_conjunta",
  })
  type?: string;

  @Column({
    default: true,
    comment: "Indicates whether the account is in analysis",
  })
  inAnalysis?: boolean;

  @Column({
    comment:
      "Indicates whether the account is the default account for the recipient",
    nullable: true,
  })
  recipientId: string;

  @Column({
    comment:
      "Indicates whether the account is the default account for the recipient",
    default: 0,
  })
  installmentAmount: number;

  @Column({
    default: undefined,
    comment: "The date & time at which the entity was soft-deleted",
    nullable: true,
  })
  deletedAt?: Date;

  @OneToOne((type) => AccountHolder, {
    cascade: true,
  })
  @JoinColumn()
  accountHolder: AccountHolder;

  @OneToOne((type) => Channel, (channel) => channel.id)
  @JoinColumn({ name: "channelId" })
  channel: Channel;
}

export { ChannelBankAccount };
