import { RequestContext, VendureEvent } from "@ericpereiraglobalsys/core";

import { NewShop } from "../../plugins/shared/types/generated-types";

/**
 * @description
 * This event is  fired when the new shop form is submitted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class NewShopEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public shop: NewShop) {
        super();
    }
}
