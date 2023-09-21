import { ErrorResult } from "@gseller/core";

export class DeployNotFoundError implements ErrorResult {
  readonly __typename = "DeployNotFoundError";
  readonly errorCode = "NOT_FOUND_ERROR";
  readonly message = "Active deploy not found.";
}

