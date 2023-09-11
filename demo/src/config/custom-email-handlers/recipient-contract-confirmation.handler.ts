import { BankAccountEvent } from "../../event-bus/events/bank-account-event";
import { EmailEventListener } from "@vendure/email-plugin";

export const recipientContractConfirmationHandler = new EmailEventListener('recipient-contract-confirmation')
  .on(BankAccountEvent)
  .setFrom('{{ fromAddress }}')
  .setRecipient(event => event.bankAccount.email)
  .setSubject(`Registro de Conta Bancária - GSeller`)
  .setTemplateVars(event => ({
    name: event.bankAccount.name
  }))