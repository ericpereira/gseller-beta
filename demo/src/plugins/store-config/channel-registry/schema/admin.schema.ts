import gql from 'graphql-tag';

export const adminApiExtensions = gql`

  type ShopNameConflictError {
    errorCode: ErrorCode!
    message: String!
  }

  input CreateShopAdministratorInput{
    firstName: String!
    lastName: String!
    emailAddress: String!
    password: String!
  }

  union CreateShopResult = EmailAddressConflictError | CurrentUser | ShopNameConflictError

  input RegisterSellerInput {
    brand: String!
    administrator: CreateShopAdministratorInput!
  }

  extend type Mutation {
    registerShop(input: RegisterSellerInput!): CreateShopResult
  }

  extend type Query {
    checkShopNameAvailability(shopName: String!): Boolean!
    getCurrentChannel: Channel!
  }

`;
