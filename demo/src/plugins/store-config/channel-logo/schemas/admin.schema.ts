import gql from "graphql-tag";

export default function adminApiExtensions() {
  return gql`
      extend type Mutation {
        setChannelLogo(file: Upload!): Asset
      }
    `;
}



