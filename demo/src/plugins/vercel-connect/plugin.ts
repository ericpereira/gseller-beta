import { EventBus, Logger, PluginCommonModule, VendurePlugin } from '@gseller/core';

import { CreateShopEvent } from '../../event-bus/events/shop-event';
import { OnApplicationBootstrap } from '@nestjs/common';
import { TemplateSelectedEvent } from '../../event-bus';
import { VercelConnectResolver } from './resolver';
import { VercelConnectService } from './service';
import { VercelDeploy } from './entities/vercel-deploy.entity';
import { VercelDeploymentWorker } from './workers/building-vercel';
import path from 'path';
import { shopApiExtensions } from './schema/shop.schema';

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [VercelDeploy],
  imports: [PluginCommonModule],
  providers: [VercelConnectService, VercelDeploymentWorker],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [VercelConnectResolver],
  }
})
export class VercelConnectPlugin implements OnApplicationBootstrap {

  constructor(
    private eventBus: EventBus,
    private vercelConnectService: VercelConnectService
  ) { }

  async onApplicationBootstrap() {
    this.channelEvent();
    this.layoutEvent();
  }

  private layoutEvent() {
    this.eventBus.ofType(TemplateSelectedEvent).subscribe(async (event) => {
      Logger.info(`Channel ${event.ctx.channel.token} template path ${event.path}`, `TemplateSelectedEvent`);

      this.vercelConnectService.deploy(event.ctx,
        event.ctx.channel.code, //nome da loja
        event.ctx.channel.token,
        event.path //path do template
      );
    });
  }

  //Generate default template
  private channelEvent() {
    this.eventBus.ofType(CreateShopEvent).subscribe(async (event) => {
      this.vercelConnectService.deploy(event.ctx,
        event.shopName, // shore name
        event.ctx.channel.token,
        'simple-store' //path do template
      );
    });
  }
}