import { EmailEventListener } from "@ericpereiraglobalsys/email-plugin";
import { PasswordResetEvent } from "@ericpereiraglobalsys/core";

export const passwordResetHandler = new EmailEventListener("password-reset")
  .on(PasswordResetEvent)
  .setRecipient((event) => event.user.identifier)
  .setFrom("{{ fromAddress }}")
  .setSubject("Forgotten password reset")
  .setTemplateVars((event) => ({
    passwordResetToken:
      event.user.getNativeAuthenticationMethod().passwordResetToken,
  }));
