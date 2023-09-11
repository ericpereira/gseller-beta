import { RequestContext, VendureEvent } from "@vendure/core";

import { ContactUs } from "../../plugins/shared/types/generated-types";

/**
 * @description
 * This event is fired when the contact us form is submitted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class ContactUsEvent extends VendureEvent {
  constructor(public ctx: RequestContext, public contact: ContactUs) {
    super();
  }
}
