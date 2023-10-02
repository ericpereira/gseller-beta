import { ErrorResult } from "@ericpereiraglobalsys/core";

export class LogoDoesExistError implements ErrorResult {
  readonly __typename = "LogoDoesntExistError";
  readonly errorCode = "CHANNEL_LOGO_DOESNT_EXIST";
  readonly message = "Channel Logo doesnt exist.";
}
