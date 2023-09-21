import { CustomCustomerFields, Order } from "@gseller/core/dist/entity/custom-entity-fields";
import { CustomOrderFields } from "@gseller/core/dist/entity/custom-entity-fields";

class CustomOrderFields {
  orderCode: string;
  pagarmeOrderId?: string;
  pagarmeQrcode?: string;
  pagarmeBoletoUrl?: string;
  pagarmePaymentType?: string;
}

declare module '@gseller/core/dist/entity/custom-entity-fields' {
  export class Order implements CustomOrderFields { }
}
