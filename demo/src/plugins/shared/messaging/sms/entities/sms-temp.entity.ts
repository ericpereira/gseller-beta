import { Column, Entity, } from "typeorm";
import {  VendureEntity } from "@vendure/core";

import { DeepPartial } from "@vendure/common/lib/shared-types";

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