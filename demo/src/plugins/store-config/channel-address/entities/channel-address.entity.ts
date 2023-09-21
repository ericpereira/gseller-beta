import { Channel, VendureEntity } from "@gseller/core";
import { Column, Entity, ManyToOne } from "typeorm";

import { DeepPartial } from "@gseller/common/lib/shared-types";

@Entity()
class ChannelAddress extends VendureEntity {
  constructor(input?: DeepPartial<ChannelAddress>) {
    super(input);
  }

  @Column({ default: undefined, nullable: true })
  deletedAt?: Date;

  @Column({ default: "" })
  fullName: string;

  @Column({ default: "" })
  company: string;

  @Column()
  @Column()
  streetLine1: string;

  @Column({ default: "" })
  streetLine2: string;

  @Column({ default: "" })
  city: string;

  @Column({ default: "" })
  province: string;

  @Column({ default: "" })
  postalCode: string;

  @Column({ default: "" })
  country: string;

  @Column({ default: "" })
  phoneNumber?: string;

  @Column({ default: false })
  distributionCenter: boolean;

  @Column({ default: "" })
  neighborhood: string;

  @Column({ default: "" })
  number: string;

  @ManyToOne((type) => Channel)
  channel: Channel;
}

export { ChannelAddress };
