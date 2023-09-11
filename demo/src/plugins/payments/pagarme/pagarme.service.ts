import {
  Configuration,
  CreateRecipientRequest,
  CustomersController,
  RecipientsController,
} from "@gabrielvenegaas/pagarmecoreapilib";

import { Injectable } from "@nestjs/common";

// import { RecipientContractService } from "../recipient-contract/recipient-contract.service";

@Injectable()
export class PagarmeService {
  constructor(/*private recipientContractService: RecipientContractService */) {
    Configuration.basicAuthUserName =
      process.env.PAGARME_SECRET_KEY || "sk_test_Lzpa6lVu5Fj50Wre";
    Configuration.basicAuthPassword =
      process.env.PAGARME_PUBLIC_KEY || "pk_test_7x4gAYYu4GCMgPkO";
  }

  createRecipient(recipient: CreateRecipientRequest) {
    return RecipientsController.createRecipient(recipient);
  }

  async getRecipient(channelToken: string) {
    // const recipientContract = await this.recipientContractService.getRecipientContract(channelToken);
    //TO DO: get recipient from database
    const recipientContract = {
      recipientId: 're_clkah9fmz04x0019th7xw1z44' //TO DO: get recipient from database
    }

    if (!recipientContract) {
      throw new Error("Recipient contract not found");
    }

    const { recipientId } = recipientContract;

    try {
      const recipient = await RecipientsController.getRecipient(recipientId);
      return { recipient, recipientContract };
    } catch (err) {
      throw new Error("Recipient not found on the gateway");
    }
  }

  async getPagarmeCustomer(id: number | string) {
    try {
      return CustomersController.getCustomer(
        id.toString(),
        null
      );
    } catch (err) {
      console.log(err);
    }

    return null;
  }
}
