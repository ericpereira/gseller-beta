import gql from "graphql-tag";

export default function adminApiExtensions() {
  return gql`
    input CreateChannelBannerInput {
      title: String!
      description: String
      link: String
      startAt: DateTime!
      endAt: DateTime!
      active: Boolean
      asset: Upload!
    }

    input CreateChannelBannerWithAssetIdInput {
      title: String!
      description: String
      link: String
      startAt: String
      endAt: String
      active: Boolean
      assetId: String!
    }

    input UpdateChannelBannerInput {
      title: String
      description: String
      link: String
      startAt: DateTime
      endAt: DateTime
      active: Boolean
      asset: Upload
      bannerId: String
    }

    type CreateChannelBannerReponse {
      active: Boolean
      description: String
      startAt: DateTime
      link: String
      title: String
      endAt: DateTime
      channel: Channel
      assetId: String
      id: Int
    }

    type ChannelBanner {
      active: Boolean
      description: String
      startAt: DateTime
      link: String
      title: String
      endAt: DateTime
      channel: Channel
      assetId: String
      id: Int
      asset: Asset
    }

    type NotUpdatedError {
      errorCode: String!
      message: String!
    }

    type BannerNotDeletedError {
      errorCode: String!
      message: String!
    }

    type AssetNotDeletedError {
      errorCode: String!
      message: String!
    }

    type BannerNotFoundError {
      errorCode: String!
      message: String!
    }

    type UpdatedSuccess {
      success: Boolean!
    }

    type DeletedSuccess {
      success: Boolean!
    }

    union updateChannelBannerResponse =
        NotUpdatedError
      | UpdatedSuccess
      | ChannelNotFoundError

    union deleteChannelBannerResponse =
        BannerNotDeletedError
      | DeletedSuccess
      | ChannelNotFoundError
      | AssetNotDeletedError
      | BannerNotFoundError

    extend type Mutation {
      setChannelBanner(
        args: CreateChannelBannerInput
      ): CreateChannelBannerReponse

      setChannelBannerWithAssetId(
        args: CreateChannelBannerWithAssetIdInput
      ): CreateChannelBannerReponse

      updateChannelBanner(
        args: UpdateChannelBannerInput
      ): updateChannelBannerResponse!

      deleteChannelBanner(bannerId: String): deleteChannelBannerResponse!
    }

    extend type Query {
      getAllBanners: [ChannelBanner!]!
    }
  `;
}
