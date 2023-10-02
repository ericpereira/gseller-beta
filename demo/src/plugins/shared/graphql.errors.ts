import { ErrorResult } from '@ericpereiraglobalsys/core';

export class EntityNotFoundError extends ErrorResult {
  readonly __typename = 'EntityNotFoundError';
  readonly errorCode = 'NotFound';
  readonly message = 'ENTITY_NOT_FOUND_ERROR';
}

export class ShopNameConflictError extends ErrorResult {
  readonly __typename = 'ShopNameConflictError';
  readonly errorCode = 'SHOP_NAME_CONFLICT_ERROR';
  readonly message = 'SHOP_NAME_CONFLICT_ERROR';
}

export class AdministratorNotFoundError extends ErrorResult {
  readonly __typename = 'AdministratorNotFoundError';
  readonly errorCode: 'ADMINISTRATOR_NOT_FOUND_ERROR';
  readonly message = 'ADMINISTRATOR_NOT_FOUND_ERROR';
}

export class BaseResult extends ErrorResult {
  readonly __typename = 'BaseResult';
  readonly errorCode = 'BASE_RESULT';
  readonly message = 'BASE_RESULT';
};

export class DocumentNumberConflictError extends ErrorResult {
  readonly __typename = 'DocumentNumberConflictError';
  readonly errorCode = 'DOCUMENT_NUMBER_CONFLICT_ERROR';
  readonly message = 'DOCUMENT_NUMBER_CONFLICT_ERROR';
}