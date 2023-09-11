import { EmailEventListener } from "@vendure/email-plugin";
import { IdentifierChangeRequestEvent } from "@vendure/core";

export const emailAddressChangeHandler = new EmailEventListener('email-address-change')
  .on(IdentifierChangeRequestEvent)
  .setRecipient(event => event.user.getNativeAuthenticationMethod().pendingIdentifier!)
  .setFrom('{{ fromAddress }}')
  .setSubject('Please verify your change of email address')
  .setTemplateVars(event => ({
    identifierChangeToken: event.user.getNativeAuthenticationMethod().identifierChangeToken,
  }))
