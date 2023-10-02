import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel, ID, VendureEntity } from "@ericpereiraglobalsys/core";
import { DeepPartial } from "@ericpereiraglobalsys/common/lib/shared-types";
import { Layout } from "./layout.entity";

@Entity()
class ChannelLayout extends VendureEntity {
    constructor(input?: DeepPartial<ChannelLayout>) {
        super(input);
    }

    @Column()
    channelId: ID;

    @Column()
    layoutId: ID;

    @Column({ default: true })
    isActive: boolean;

    @ManyToOne(type => Layout, { eager: true })
    layout: Layout;

    @ManyToOne(type => Channel, { eager: true })
    channel: Channel;
}

export { ChannelLayout }