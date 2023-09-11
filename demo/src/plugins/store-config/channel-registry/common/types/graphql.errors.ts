import { ErrorResult } from '@vendure/core';

export class ShopNameConflictError extends ErrorResult {
  readonly __typename = 'ShopNameConflictError';
  readonly errorCode = 'SHOP_NAME_CONFLICT';
  readonly message = 'This shop name is already registered.';
}

export class EmailAddressConflictError extends ErrorResult {
  readonly __typename = 'EmailAddressConflictError';
  readonly errorCode = 'EMAIL_ADDRESS_CONFLICT';
  readonly message = 'This email address is already registered.';
}
