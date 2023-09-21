import { Channel, VendureEntity } from "@gseller/core";
import { Column, Entity, Index, OneToOne } from "typeorm";

import { DeepPartial } from "@gseller/common/lib/shared-types";

@Entity()
@Index('idx_channel_social_media_nome', ['nome'])
@Index('idx_channel_social_media_channel_id', ['channelId'])
class ChannelSocialMedia extends VendureEntity {

    constructor(input?: DeepPartial<ChannelSocialMedia>) {
        super(input);
    }

    @Column({
        default: undefined,
        nullable: true,
        comment: 'The date & time at which the entity was soft-deleted',
    })
    deletedAt?: Date;

    @Column({
        comment: 'The name of the social media',
    })
    nome: string;

    @Column({
        comment: 'The link of the social media'
    })
    link: string;

    @OneToOne(type => Channel, channel => channel.id)
    @Column({ default: '' })
    channelId: string;
}

export { ChannelSocialMedia }