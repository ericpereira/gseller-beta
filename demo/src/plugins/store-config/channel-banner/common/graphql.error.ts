import { ErrorResult } from "@vendure/core";

export class BannerNotUpdatedError implements ErrorResult {
  readonly __typename = "BannerNotUpdatedError";
  readonly errorCode = "NOT_UPDATED_ERROR";
  readonly message = "Banner not updated.";
}

export class BannerNotFoundError implements ErrorResult {
  readonly __typename = "BannerNotFoundError";
  readonly errorCode = "NOT_FOUND_ERROR";
  readonly message = "Banner not found.";
}

export class ChannelNotFoundError implements ErrorResult {
  readonly __typename = "ChannelNotFoundError";
  readonly errorCode = "CHANNEL_NOT_FOUND";
  readonly message = "Channel not found.";
}

export class BannerNotDeletedError implements ErrorResult {
  readonly __typename = "BannerNotDeletedError";
  readonly errorCode = "NOT_DELETED_ERROR";
  readonly message = "Banner not deleted.";
}

export class AssetNotDeletedError implements ErrorResult {
  readonly __typename = "AssetNotDeletedError";
  readonly errorCode = "NOT_DELETED_ERROR";
  readonly message = "Asset not deleted.";
}
