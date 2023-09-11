import { ErrorResult } from "@vendure/core";

export class TemplateNotFoundError implements ErrorResult {
  readonly __typename = "TemplateNotFoundError";
  readonly errorCode = "TEMPLATE_NOT_FOUND";
  readonly message = "Template not found";
}

export class VercelDeploymentFailedError implements ErrorResult {
  readonly __typename = "VercelDeploymentFailedError";
  readonly errorCode = "VERCEL_DEPLOYMENT_FAILED";
  readonly message = "Vercel deployment failed";
}

export class VercelDeploymentInformationError implements ErrorResult {
  readonly __typename = "VercelDeploymentInformationError";
  readonly errorCode = "VERCEL_DEPLOYMENT_INFORMATION_ERROR";
  readonly message = "Error saving deployment information";
}