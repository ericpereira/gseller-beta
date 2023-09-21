import { EventBus, PluginCommonModule, VendurePlugin } from '@gseller/core';
import { Deploy } from './entities/deploy.entity';
import { DeploysAdminResolver } from './resolvers/admin.resolver';
import AdminSchema from './schema/admin.schema';
import { BuildPlatformEvent } from '../../event-bus/events/build-platform.event';
import { BuildVercelEvent } from '../../event-bus/events/build-vercel.event';
import { DeploysService } from './services';
import { OnApplicationBootstrap } from '@nestjs/common';

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [Deploy],
  imports: [PluginCommonModule],
  providers: [DeploysService],
  adminApiExtensions: {
    resolvers: [DeploysAdminResolver],
    schema: AdminSchema
  }
})
export class DeploysPlugin implements OnApplicationBootstrap {

  constructor(
    private eventBus: EventBus,
    private deploysService: DeploysService
  ) { }

  async onApplicationBootstrap() {
    this.listenBuildPlatformEvent();
  }

  private listenBuildPlatformEvent() {
    this.eventBus.ofType(BuildPlatformEvent).subscribe(async (event) => {
      this.deploysService.registerDeploy(event.ctx, event.input);
    });
  }
}

