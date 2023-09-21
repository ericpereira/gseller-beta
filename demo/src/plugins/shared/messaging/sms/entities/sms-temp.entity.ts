import { Column, Entity, } from "typeorm";
import {  VendureEntity } from "@gseller/core";

import { DeepPartial } from "@gseller/common/lib/shared-types";

@Entity()
class TempSms extends VendureEntity {
    constructor(input?: DeepPartial<TempSms>) {
        super(input);
    }
    @Column()
    userId: string;

    @Column()
    code: string;

    @Column()
    phoneNumber: string;
}

export { TempSms };