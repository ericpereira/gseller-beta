import { ErrorResult, Scalars } from '@ericpereiraglobalsys/core';

export class DocumentNumberConflictError extends ErrorResult {
  readonly __typename = 'DocumentNumberConflictError';
  readonly errorCode = 'DOCUMENT_NUMBER_CONFLICT_ERROR';
  readonly message = 'DOCUMENT_NUMBER_CONFLICT_ERROR';
}

export class ChannelNotFoundError extends ErrorResult {
  readonly __typename = 'ChannelNotFoundError';
  readonly errorCode = 'CHANNEL_NOT_FOUND_ERROR';
  readonly message = 'CHANNEL_NOT_FOUND_ERROR'
}

export class BankAccountNotFoundError extends ErrorResult {
  readonly __typename = 'BankAccountNotFoundError';
  readonly errorCode = 'BANK_ACCOUNT_NOT_FOUND_ERROR';
  readonly message = 'BANK_ACCOUNT_NOT_FOUND_ERROR';
}

export class AccountHolderNotFoundError extends ErrorResult {
  readonly __typename = 'AccountHolderNotFoundError';
  readonly errorCode = 'ACCOUNT_HOLDER_NOT_FOUND_ERROR';
  readonly message = 'ACCOUNT_HOLDER_NOT_FOUND_ERROR';
}

export class AccountHolderAlreadyExistsError extends ErrorResult {
  readonly __typename = 'AccountHolderAlreadyExistsError';
  readonly errorCode = 'ACCOUNT_HOLDER_ALREADY_EXISTS_ERROR';
  readonly message = 'Account holder already exists.';
}

export class CannotDeleteAccountHolderError extends ErrorResult {
  readonly __typename = 'CannotDeleteAccountHolderError';
  readonly errorCode = 'CANNOT_DELETE_ACCOUNT_HOLDER_ERROR';
  readonly message = 'Cannot delete account holder because it is associated with a bank account.';
}
