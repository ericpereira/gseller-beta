import { Channel, VendureEntity } from "@gseller/core";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { DeepPartial } from "@gseller/common/lib/shared-types";

@Entity()
export class AccountHolder extends VendureEntity {
  constructor(input?: DeepPartial<AccountHolder>) {
    super(input);
  }

  @Column({ length: 20, comment: "CPF or CNPJ of the Account Holder" })
  documentNumber: string;

  @Column({
    length: 30,
    comment:
      "Full Name or Legal Entity Name (maximum 30 characters, letters only)",
    nullable: true,
  })
  legalName?: string;

  @Column({
    length: 30,
    comment: "Account Holder Name (maximum 30 characters, letters only)",
    nullable: true,
  })
  holderType: "individual" | "company";

  @Column({
    default: undefined,
    comment: "The date & time at which the entity was soft-deleted",
    nullable: true,
  })
  deletedAt?: Date;

  @OneToOne((type) => Channel, (channel) => channel.id)
  @JoinColumn({ name: "channelId" })
  channel: Channel;
}
