import { EmailEventListener } from "@ericpereiraglobalsys/email-plugin";
import { IdentifierChangeRequestEvent } from "@ericpereiraglobalsys/core";

export const emailAddressChangeHandler = new EmailEventListener('email-address-change')
  .on(IdentifierChangeRequestEvent)
  .setRecipient(event => event.user.getNativeAuthenticationMethod().pendingIdentifier!)
  .setFrom('{{ fromAddress }}')
  .setSubject('Please verify your change of email address')
  .setTemplateVars(event => ({
    identifierChangeToken: event.user.getNativeAuthenticationMethod().identifierChangeToken,
  }))
