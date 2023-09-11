import { EventBus, PluginCommonModule, VendurePlugin } from "@vendure/core";

import { BankAccountEvent } from "../../event-bus/events/bank-account-event";
import { OnApplicationBootstrap } from '@nestjs/common';
import { PagarmeService } from "./pagarme/pagarme.service";
import { Recipient } from "./payments-permissions";
import { RecipientContractServices } from './workers/recipient.worker';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  providers: [PagarmeService, RecipientContractServices],
  configuration: (config) => {
    config.authOptions.customPermissions.push(Recipient);
    return config;
  },
})
export class PaymentsPlugin implements OnApplicationBootstrap {

  constructor(
    private recipientContractServices: RecipientContractServices,
    private eventBus: EventBus
  ) { }

  async onApplicationBootstrap() {
    this.eventBus.ofType(BankAccountEvent).subscribe(async (event) => {
      this.recipientContractServices.main(event.bankAccount);
    });
  }

}
