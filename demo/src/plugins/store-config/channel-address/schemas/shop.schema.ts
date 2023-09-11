import gql from "graphql-tag";

export default function ShopSchema() {
  return gql`
    type AddressNotFoundError {
      errorCode: String!
      message: String!
    }

    type ChannelNotFoundError {
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

    type ChannelAddressResponse {
      address: [ChannelAddress]
      channel: Channel!
    }

    union getChannelAddressResponse =
        ChannelAddressResponse
      | AddressNotFoundError
      | ChannelNotFoundError

    extend type Query {
      getChannelAddress(channelId: String!): getChannelAddressResponse
      getActiveChannelAddress: getChannelAddressResponse
    }
  `;
}
