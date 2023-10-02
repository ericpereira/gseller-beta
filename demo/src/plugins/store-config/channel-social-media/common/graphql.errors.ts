import { ErrorResult } from '@ericpereiraglobalsys/core';

export class SocialMediaAlreadyRegisteredError extends ErrorResult {
  readonly __typename = 'SocialMediaAlreadyRegisteredError';
  readonly errorCode = 'SOCIAL_MEDIA_ALREADY_REGISTERED';
  readonly message = 'Social media already registered';
}

export class SocialMediaNotFoundError extends ErrorResult {
  readonly __typename = 'SocialMediaNotFoundError';
  readonly errorCode = 'SOCIAL_MEDIA_NOT_FOUND';
  readonly message = 'Social media not found';
}
