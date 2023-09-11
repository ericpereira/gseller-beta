import gql from "graphql-tag";

export default function AdminSchema() {
  return gql`

      type AddressNotFoundError {
        errorCode: String!
        message: String!
      }

      type ChannelAddress {
        id: ID!
        fullName: String
        company: String
        streetLine1: String!
        streetLine2: String
        city: String!
        province: String!
        postalCode: String!
        country: String!
        phoneNumber: String!
        channel: Channel!
        createdAt: DateTime!
        updatedAt: DateTime!
        distributionCenter: Boolean
        neighborhood: String!
        number: String!
      }

      type AddressAlreadyRegisteredError  {
        errorCode: String!
        message: String!
      }

      type DistributionCenterAlreadyRegisteredError  {
        errorCode: String!
        message: String!
      }
  
      input RegisterChannelAddressInput {
        fullName: String
        company: String
        streetLine1: String!
        streetLine2: String
        city: String!
        province: String!
        postalCode: String!
        country: String!
        phoneNumber: String
        distributionCenter: Boolean
        neighborhood: String!
        number: String!
      }
  
      input UpdateChannelAddressInput {
        fullName: String
        company: String
        streetLine1: String
        streetLine2: String
        city: String
        province: String
        postalCode: String
        country: String
        phoneNumber: String
        distributionCenter: Boolean
        neighborhood: String
        number: String
      }

      union ChannelAddressResult = ChannelAddress | AddressAlreadyRegisteredError | DistributionCenterAlreadyRegisteredError
      union ChannelAddressDeleteResult = Success |  AddressNotFoundError
      union channelAddressResult = AddressNotFoundError | ChannelAddress
      union channelDistributionCenterResult = AddressNotFoundError | ChannelAddress
      
      extend type Mutation {
        registerChannelAddress(input: RegisterChannelAddressInput!): ChannelAddressResult!
        updateChannelAddress(input: UpdateChannelAddressInput!): ChannelAddress!
        updateChannelDistributionCenter(input: UpdateChannelAddressInput!): ChannelAddress!
        deleteChannelAddress(id: String!): ChannelAddressDeleteResult!
      }

      extend type Query {
        channelAddress: channelAddressResult
        channelDistributionCenter: channelDistributionCenterResult
      }
    `;
}
