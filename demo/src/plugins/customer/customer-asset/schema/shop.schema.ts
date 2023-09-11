import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  type MimeTypeError implements ErrorResult {
    errorCode: ErrorCode!
    message: String!
    fileName: String!
    mimeType: String!
  }
  union CreateAssetResult = Asset | MimeTypeError
  input CreateAssetInput {
    file: Upload!
    tags: [String!]
  }
  extend type Mutation {
    setCustomerAvatar(file: CreateAssetInput!): CreateAssetResult
  }
`;
