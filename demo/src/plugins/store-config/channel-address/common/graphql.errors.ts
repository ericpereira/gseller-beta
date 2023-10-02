import { ErrorResult } from '@ericpereiraglobalsys/core';
export class AddressAlreadyRegisteredError extends ErrorResult {
  readonly __typename = 'AddressAlreadyRegisteredError';
  readonly errorCode = 'ADDRESS_ALREADY_REGISTERED';
  readonly message = 'This address is already registered.';
}

export class DistributionCenterAlreadyRegisteredError extends ErrorResult {
  readonly __typename = 'DistributionCenterAlreadyRegisteredError';
  readonly errorCode = 'DISTRIBUTION_CENTER_ALREADY_REGISTERED';
  readonly message = 'This distribution center is already registered.';
}

export class ChannelNotFoundError extends ErrorResult {
  readonly __typename = 'ChannelNotFoundError';
  readonly errorCode = 'CHANNEL_NOT_FOUND';
  readonly message = 'Channel not found.';
}

export class AddressNotFoundError extends ErrorResult {
  readonly __typename = 'AddressNotFoundError';
  readonly errorCode = 'ADDRESS_NOT_FOUND';
  readonly message = 'Address not found.';
}