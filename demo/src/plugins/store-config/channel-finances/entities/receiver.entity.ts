import { Channel, VendureEntity } from "@ericpereiraglobalsys/core";
import { Column, Entity, OneToOne } from "typeorm";

import { DeepPartial } from "@ericpereiraglobalsys/common/lib/shared-types";

@Entity()
class Receiver extends VendureEntity {

    constructor(input?: DeepPartial<Receiver>) {
        super(input);
    }

    @Column({
        default: undefined,
        nullable: true,
    })
    deletedAt?: Date;

    @Column({ default: false, comment: 'Defines if the receiver can automatically receive payments on defined day and interval' })
    transferEnabled: boolean;

    @Column({ default: 'daily', comment: 'Defines the frequency at which the available values on Pagar.me are automatically transferred to the receiver\'s bank account: daily, weekly, monthly' })
    transferInterval: string;

    @Column({ default: 0, comment: 'Defines the day for automatic transfers to the receiver, based on the chosen transferInterval. Valid values are: 1 to 5 for weekly, 1 to 31 for monthly, and 0 for daily' })
    transferDay: number;

    @Column({ default: 0, comment: 'Defines the percentage of the receivable amount that the receiver can anticipate with Pagar.me. Default value is 0' })
    anticipatableVolumePercentage: number;

    @Column({ default: false, comment: 'Defines if the receiver can receive automatic anticipations' })
    automaticAnticipationEnabled: boolean;

    @Column({ comment: 'Contains the id of a previously created bank account. More details: Creating a bank account' })
    bankAccountId: number;

    @Column({ comment: 'URL (endpoint) of your system that receives notifications for each change in transaction status' })
    postbackUrl: string;

    @OneToOne(type => Channel, channel => channel.id)
    @Column({ default: '' })
    channelId: string;
}

export { Receiver }