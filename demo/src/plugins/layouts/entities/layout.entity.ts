import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Asset, ID, VendureEntity } from "@ericpereiraglobalsys/core";
import { DeepPartial } from "@ericpereiraglobalsys/common/lib/shared-types";
import { LayoutCategory } from "./layout-category.entity";
import { LayoutTypes } from "../types";

@Entity()
class Layout extends VendureEntity {
    constructor(input?: DeepPartial<Layout>) {
        super(input);
    }

    @Column({ nullable: true })
    webAssetId?: ID;

    @Column({ nullable: true })
    mobileAssetId?: ID;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    title: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column({ comment: "Layout file url or relative path", type: 'text' })
    path: string;

    @Column({
        type: 'enum',
        enum: LayoutTypes,
        default: LayoutTypes.web,
        comment: "Layout type (e.g., 'WEB', 'MOBILE')"
    })
    type: LayoutTypes;

    @Column({type: 'float', default: 0})
    price: number;

    @ManyToMany(type => LayoutCategory, { eager: true, nullable: true })
    @JoinTable({
        name: 'layout_categories',
        joinColumn: { name: 'layoutId' },
        inverseJoinColumn: { name: 'layoutCategoryId' }
    })
    categories: LayoutCategory[];

    @ManyToOne(type => Asset, { eager: true })
    webAsset: Asset;

    @ManyToOne(type => Asset, { eager: true })
    mobileAsset: Asset;
}

export { Layout }