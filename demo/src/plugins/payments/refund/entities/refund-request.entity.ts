import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Asset, Channel, Customer, ID, Order, Payment, RefundState, VendureEntity } from "@ericpereiraglobalsys/core";
import { DeepPartial } from "@ericpereiraglobalsys/common/lib/shared-types";

@Entity()
class RefundRequest extends VendureEntity {
    constructor(input?: DeepPartial<RefundRequest>) {
        super(input);
    }
    @PrimaryGeneratedColumn()
    id: ID;

    @Column()
    customerId?: ID;

    @Column()
    orderId?: ID;

    @Column()
    paymentId?: ID;

    @Column()
    channelId?: ID;

    @Column({ nullable: true })
    nfePdfId?: ID;

    @Column()
    status?: RefundState;

    @Column()
    nfeKey?: string;

    @Column({ nullable: true })
    reason?: string;

    @ManyToMany(type => Asset)
    @JoinTable({
        name: 'refund_request_asset',
        joinColumn: { name: 'refundRequestId' },
        inverseJoinColumn: { name: 'assetId' }
    })
    assets?: Asset[];

    @ManyToOne(type => Customer)
    customer: Customer;

    @ManyToOne(type => Order)
    order: Order;

    @ManyToOne(type => Payment)
    payment: Payment;

    @ManyToOne(type => Channel)
    channel: Channel;

    @ManyToOne(type => Asset)
    nfePdf: Asset;
}

export { RefundRequest }