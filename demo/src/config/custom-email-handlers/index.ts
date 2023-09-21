import { contactHandler } from "./contact.handler";
import { emailAddressChangeHandler } from "./email-address-change.handler"
import { emailVerificationHandler } from "./email-verification.handler"
import { inviteFriendtHandler } from "./invite-friend.handler"
import { newShopHandler } from "./new-shop.handler";
import { passwordResetHandler } from "./password-reset.handler"
import { recipientContractConfirmationHandler } from "./recipient-contract-confirmation.handler"

export default [
  contactHandler,
  newShopHandler,
  passwordResetHandler,
  inviteFriendtHandler,
  emailAddressChangeHandler,
  emailVerificationHandler,
  recipientContractConfirmationHandler,
];
