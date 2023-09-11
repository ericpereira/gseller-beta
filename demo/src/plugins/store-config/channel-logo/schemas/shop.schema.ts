import gql from "graphql-tag";

export default function shopApiExtensions() {
  return gql`
    type LogoDoesntExistError {
      errorCode: String!
      message: String!
    }

    union ChannelLogoResult = Asset | LogoDoesntExistError

    extend type Query {
      channelLogo: ChannelLogoResult
    }
  `;
}
