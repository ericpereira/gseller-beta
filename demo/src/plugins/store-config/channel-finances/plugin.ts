import { EventBus, PluginCommonModule, VendurePlugin } from '@ericpereiraglobalsys/core';

import { AccountHolder } from './entities/account.holder.entity';
import { AccountHolderService } from './services/account-holder.service';
import { ChannelBankAccount } from './entities/bank-account.entity';
import { ContextStrategy } from './context-auth-strategy';
import { FinancesResolver } from './resolvers/admin.resolver';
import { FinancesService } from './services/bank-account.service';
import { OnApplicationBootstrap } from '@nestjs/common';
import { RecipientContractEvent } from '../../../event-bus/events/recipient-contract-event';
import { adminApiExtensions } from './schema/admin.schema';
import { financesWorker } from './workers/finances.worker';
import { manageChannelFinancesPermission } from './permission';

@VendurePlugin({
  compatibility: "2.0.5",
  entities: [AccountHolder, ChannelBankAccount],
  imports: [PluginCommonModule],
  providers: [
    FinancesService,
    AccountHolderService,
    financesWorker,
    ContextStrategy
  ],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [FinancesResolver, AccountHolderService],
  },
  configuration: (config) => {
    config.authOptions.customPermissions.push(manageChannelFinancesPermission)
    return config;
  },
})
export class FinancesPlugin implements OnApplicationBootstrap {

  constructor(
    private financesWorker: financesWorker,
    private eventBus: EventBus
  ) { }

  async onApplicationBootstrap() {
    this.eventBus.ofType(RecipientContractEvent).subscribe(async (event) => {
      this.financesWorker.main(event.recipientContract);
    });
  }

}

