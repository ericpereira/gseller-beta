import { CustomCustomerFields, Order } from "@ericpereiraglobalsys/core/dist/entity/custom-entity-fields";
import { CustomOrderFields } from "@ericpereiraglobalsys/core/dist/entity/custom-entity-fields";

class CustomOrderFields {
  orderCode: string;
  pagarmeOrderId?: string;
  pagarmeQrcode?: string;
  pagarmeBoletoUrl?: string;
  pagarmePaymentType?: string;
}

declare module '@ericpereiraglobalsys/core/dist/entity/custom-entity-fields' {
  export class Order implements CustomOrderFields { }
}
