import { RequestContext, VendureEvent } from "@gseller/core";

/**
 * @description
 * This event is fired when the new shop form is submitted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class TemplateSelectedEvent extends VendureEvent {
  constructor(
    public ctx: RequestContext,
    public path: string
    ) {
    super();
  }
}
