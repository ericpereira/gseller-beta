import gql from "graphql-tag";

export default function ShopSchema() {
    return gql`
    type ChannelSocialMedia {
        id: ID!
        nome: String!
        link: String!
        channel: Channel!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type ChannelSocialMediaList {
        items: [ChannelSocialMedia!]!
        totalItems: Int!
    }

    extend type Query {
        getChannelSocialMedia: ChannelSocialMediaList
    }
    `;
}
