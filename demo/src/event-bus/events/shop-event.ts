import { RequestContext, VendureEvent } from "@gseller/core";

/**
 * @description
 * This event is  fired when the new shop form is submitted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class CreateShopEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public shopName: string) {
        super();
    }
}
