import { ID } from "@ericpereiraglobalsys/core";
import { LayoutCategory } from "./entities/layout-category.entity";

export enum LayoutTypes {
    web = 'WEB',
    mobile = 'MOBILE'
}

export type InputCreateLayout = {
    title: string;
    webAssetId?: ID;
    mobileAssetId?: ID;
    isActive: boolean;
    description?: string;
    path?: string;
    type: LayoutTypes;
    price?: number;
    categories?: [number];
}