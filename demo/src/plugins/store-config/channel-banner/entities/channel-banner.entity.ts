import { Asset, Channel, ID, VendureEntity } from "@gseller/core";
import { Column, Entity, JoinTable, ManyToOne } from "typeorm";

import { DeepPartial } from "@gseller/common/lib/shared-types";

@Entity()
class ChannelBanner extends VendureEntity {
  constructor(input?: DeepPartial<ChannelBanner>) {
    super(input);
  }
  @Column({
    comment: "The title of the banner",
    nullable: true,
    default: null,
  })
  title: string;

  @Column({
    comment: "The description of the banner",
    nullable: true,
    default: null,
  })
  description: string;

  @Column({
    comment: "The link to the banner",
    nullable: true,
    default: null,
  })
  link?: string;

  @Column({
    comment: "The date & time at which the entity was soft-deleted",
    default: () => "CURRENT_TIMESTAMP",
  })
  startAt: Date;

  @Column({
    comment: "The date & time at which the entity was soft-deleted",
    nullable: true,
    default: null,
  })
  endAt?: Date;

  @Column({
    default: true,
    comment: "Whether the banner is active or not",
  })
  active: boolean;

  @Column()
  assetId?: ID;

  @ManyToOne((type) => Asset)
  asset: Asset;

  @ManyToOne((type) => Channel)
  channel: Channel;
}

export { ChannelBanner };
