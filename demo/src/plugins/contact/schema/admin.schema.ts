import gql from 'graphql-tag';

export const adminApiExtensions = gql`

  type Contact {
    id: ID
    firstName: String
    lastName: String
    emailAddress: String
    phoneNumber: String
    country: String
    region: String
    message: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  extend type Query {
    getAllRequestContact: [Contact!]!
  }
 
`;
