import { RequestContext, VendureEvent } from "@vendure/core";

export class RegisterDistribuitionCenterEvent extends VendureEvent {
  constructor(public ctx: RequestContext) {
    super();
  }
}
