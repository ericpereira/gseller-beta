import { RequestContext, VendureEvent } from "@vendure/core";

import { InviteFriend } from "../../plugins/shared/types/generated-types";

/**
 * @description
 * This event is  fired when the invite friend form is submitted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class InviteFriendEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public invite: InviteFriend) {
        super();
    }
}
