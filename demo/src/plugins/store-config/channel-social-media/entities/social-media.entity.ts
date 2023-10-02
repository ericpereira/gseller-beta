import { Channel, VendureEntity } from "@ericpereiraglobalsys/core";
import { Column, Entity, Index, OneToOne, ManyToOne } from "typeorm";

import { DeepPartial } from "@ericpereiraglobalsys/common/lib/shared-types";

@Entity()
@Index("idx_channel_social_media_nome", ["nome"])
// @Index("idx_channel_social_media_channel_id", ["channelId"])
class ChannelSocialMedia extends VendureEntity {
  constructor(input?: DeepPartial<ChannelSocialMedia>) {
    super(input);
  }

  @Column({
    default: undefined,
    nullable: true,
    comment: "The date & time at which the entity was soft-deleted",
  })
  deletedAt?: Date;

  @Column({
    comment: "The name of the social media",
    nullable: true,
  })
  nome: string;

  @Column({
    comment: "The link of the social media",
    nullable: true,
  })
  link: string;

  @ManyToOne((type) => Channel)
  channel: Channel;
}

export { ChannelSocialMedia };
