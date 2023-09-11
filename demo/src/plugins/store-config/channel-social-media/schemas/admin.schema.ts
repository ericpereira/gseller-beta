import { SocialMediaName } from "../common/enum.schema";
import gql from "graphql-tag";

export default function AdminSchema() {
  return gql`

  ${SocialMediaName}

  type SocialMediaAlreadyRegisteredError  {
    errorCode: String!
    message: String!
  }

  type SocialMediaNotFoundError  {
    errorCode: String!
    message: String!
  }

  type ChannelSocialMedia {
    id: ID!
    nome: SocialMediaName!
    link: String!
    channel: Channel!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
  }

  type ChannelSocialMediaList {
    items: [ChannelSocialMedia!]!
    totalItems: Int!
  }

  input CreateChannelSocialMediaInput {
    nome: SocialMediaName!
    link: String!
  }

    input UpdateChannelSocialMediaInput {
      nome: SocialMediaName
      link: String
    }

    union ChannelSocialMediaResult = ChannelSocialMedia | SocialMediaAlreadyRegisteredError
    union UpdateChannelSocialMediaResult = ChannelSocialMedia | SocialMediaNotFoundError
    
    extend type Mutation {
      createChannelSocialMedia(input: CreateChannelSocialMediaInput!): ChannelSocialMediaResult!
      updateChannelSocialMedia(input: UpdateChannelSocialMediaInput!): UpdateChannelSocialMediaResult!
      deleteChannelSocialMedia(id: ID!): Boolean!
    }

    extend type Query {
      getChannelSocialMedia: ChannelSocialMediaList
    }

    `;
}
