import { AccountRegistrationEvent, NativeAuthenticationMethod } from "@ericpereiraglobalsys/core";

import { EmailEventListener } from "@ericpereiraglobalsys/email-plugin";

export const emailVerificationHandler = new EmailEventListener('email-verification')
  .on(AccountRegistrationEvent)
  .filter(event => !!event.user.getNativeAuthenticationMethod().identifier)
  .filter(event => {
    const nativeAuthMethod = event.user.authenticationMethods.find(
      m => m instanceof NativeAuthenticationMethod,
    ) as NativeAuthenticationMethod | undefined;
    return (nativeAuthMethod && !!nativeAuthMethod.identifier) || false;
  })
  .setRecipient(event => event.user.identifier)
  .setFrom('{{ fromAddress }}')
  .setSubject('Please verify your email address')
  .setTemplateVars(event => ({
    verificationToken: event.user.getNativeAuthenticationMethod().verificationToken,
  }))
