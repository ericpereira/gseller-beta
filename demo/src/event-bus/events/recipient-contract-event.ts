import { RecipientContractInput } from "@gseller/common/lib/generated-types";
import { VendureEvent } from "@gseller/core";

/**
 * @description
 * This event is  fired when the recipient contract form is submitted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class RecipientContractEvent extends VendureEvent {
  constructor(public recipientContract: RecipientContractInput) {
    super();
  }
}
