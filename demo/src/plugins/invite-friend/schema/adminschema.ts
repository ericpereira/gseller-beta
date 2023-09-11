import gql from 'graphql-tag';

export const adminApiExtensions = gql`
  extend type Mutation {
    inviteFriendProducer(emailAddress: String!): BaseResult
  }
`;
