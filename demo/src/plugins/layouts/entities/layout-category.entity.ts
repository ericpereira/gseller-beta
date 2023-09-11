import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ID, VendureEntity } from "@vendure/core";
import { DeepPartial } from "@vendure/common/lib/shared-types";

@Entity()
class LayoutCategory extends VendureEntity {
    constructor(input?: DeepPartial<LayoutCategory>) {
        super(input);
    }

    @Column({ unique: true })
    title: string;
}

export { LayoutCategory }