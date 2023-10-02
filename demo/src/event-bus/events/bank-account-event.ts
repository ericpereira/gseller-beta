import { RequestContext, VendureEvent } from "@ericpereiraglobalsys/core";

import { PaymentAccountInput } from "@ericpereiraglobalsys/common/lib/generated-types";

/**
 * @description
 * This event is fired when the bank account is created or updated.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class BankAccountEvent extends VendureEvent {
  constructor(public ctx: RequestContext, public bankAccount: PaymentAccountInput) {
    super();
  }
}
