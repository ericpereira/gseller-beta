import { ID, RequestContext, VendureEvent } from "@vendure/core";

import { VendureEntityEvent } from "@vendure/core/dist/event-bus/vendure-entity-event";
import { Deploy, DeployType } from "../../plugins/deploys/entities/deploy.entity";

/**
 * @description
 * This event is fired when the build is successful and the build result is available.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */

export type DeployPlatformEventInput = {
    platform: DeployType,
    url?: string,
    metadata?: string
}

export class BuildPlatformEvent extends VendureEvent{
  constructor(
    public ctx: RequestContext,
    public input: DeployPlatformEventInput
  ) {
    super();
  }
}