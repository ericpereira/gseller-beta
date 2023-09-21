import { RequestContext, VendureEvent } from "@gseller/core";

export class RegisterDistribuitionCenterEvent extends VendureEvent {
  constructor(public ctx: RequestContext) {
    super();
  }
}
