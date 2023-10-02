import { RequestContext, VendureEvent } from "@ericpereiraglobalsys/core";

export class RegisterDistribuitionCenterEvent extends VendureEvent {
  constructor(public ctx: RequestContext) {
    super();
  }
}
