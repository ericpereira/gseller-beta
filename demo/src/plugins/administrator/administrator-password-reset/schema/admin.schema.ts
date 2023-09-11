import gql from 'graphql-tag';

export default function administratorAuthSchema() {
  const administratorAuthApiExtensions = gql`

    type PasswordResetTokenInvalidError implements ErrorResult {
      errorCode: ErrorCode!
      message: String!
    }
    type PasswordResetTokenExpiredError implements ErrorResult {
      errorCode: ErrorCode!
      message: String!
    }
    type PasswordValidationError implements ErrorResult {
      errorCode: ErrorCode!
      message: String!
    }

    type NotVerifiedError implements ErrorResult {
      errorCode: ErrorCode!
      message: String!
    }

    type AdministratorNotFoundError implements ErrorResult {
      errorCode: ErrorCode!
      message: String!
    }

    union RequestPasswordResetResult = NativeAuthStrategyError | Success | AdministratorNotFoundError

    union ResetPasswordResult =
        Success
      | PasswordResetTokenInvalidError
      | PasswordResetTokenExpiredError
      | PasswordValidationError
      | NativeAuthStrategyError
      | NotVerifiedError
      | AdministratorNotFoundError

    extend type Mutation {
      requestPasswordReset(emailAddress: String!): RequestPasswordResetResult
      resetPassword(token: String!, password: String!): ResetPasswordResult!
    }
  `;

  return administratorAuthApiExtensions;
}
