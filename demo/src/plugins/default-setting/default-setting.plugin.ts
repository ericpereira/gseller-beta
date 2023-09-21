import { OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import {
  PluginCommonModule,
  VendurePlugin,
} from '@gseller/core';

import { ContextStrategy } from './context-auth-strategy';
import { PopulateSettings } from './setup/populate';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [PopulateSettings, ContextStrategy],
})
export class SynchronizationPlugin implements OnModuleInit {
  constructor(private populateSettings: PopulateSettings) { }

  async onModuleInit() {
    this.populateSettings.initialDataConfig();
  }
}
