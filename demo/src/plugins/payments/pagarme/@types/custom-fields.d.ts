import { CustomCustomerFields, Order } from "@vendure/core/dist/entity/custom-entity-fields";
import { CustomOrderFields } from "@vendure/core/dist/entity/custom-entity-fields";

class CustomOrderFields {
  orderCode: string;
  pagarmeOrderId?: string;
  pagarmeQrcode?: string;
  pagarmeBoletoUrl?: string;
  pagarmePaymentType?: string;
}

declare module '@vendure/core/dist/entity/custom-entity-fields' {
  export class Order implements CustomOrderFields { }
}
