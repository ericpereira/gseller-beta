import gql from 'graphql-tag';

export const adminApiExtensions = gql`
  extend type Mutation {
    setAdministratorAvatar(file: CreateAssetInput!): CreateAssetResult
    setAdministratorBanner(file: CreateAssetInput!): CreateAssetResult
  }
`;
