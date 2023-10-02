import { ID } from "@ericpereiraglobalsys/core";

export type InputCreateRefundRequest = {
    orderCode: string;
    nfeKey: string;
    reason?: string;
    nfePdf?: any;
    assets?: Array<any>
}