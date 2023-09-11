import gql from 'graphql-tag';

export const shopApiExtensions = gql`

  input contactInput {
    firstName: String!
    lastName: String
    emailAddress: String!
    phoneNumber: String
    country: String
    region: String
    message: String!
  }

  extend type Mutation {
    requestContact(input: contactInput!): BaseResult
  }
`;
