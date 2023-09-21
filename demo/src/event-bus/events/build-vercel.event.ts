import { RequestContext } from "@gseller/core";

import { VendureEntityEvent } from "@gseller/core/dist/event-bus/vendure-entity-event";
import { VercelDeploy } from "../../plugins/vercel-connect/entities/vercel-deploy.entity";

/**
 * @description
 * This event is fired when the build is successful and the build result is available.
 *
 * @docsCategory events
 * @docsPage Event Types
 * 
 */
export class BuildVercelEvent extends VendureEntityEvent<VercelDeploy> {
  constructor(
    ctx: RequestContext,
    entity: VercelDeploy,
    type: 'created' | 'updated' | 'deleted',
  ) {
    super(entity, type, ctx);
  }
}



