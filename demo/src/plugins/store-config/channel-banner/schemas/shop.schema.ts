import gql from "graphql-tag";

export default function shopApiExtensions() {
  return gql`
    type channelBannersByChannelResponse {
      title: String
      description: String
      link: String
      startAt: DateTime
      endAt: DateTime
      active: Boolean
      assetId: String
      id: Int
      asset: Asset
    }

    extend type Query {
      channelBanners: [channelBannersByChannelResponse]!
    }
  `;
}
