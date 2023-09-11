import gql from "graphql-tag";

export default function ShopSchema() {
  return gql`
    extend type Query {
      currentChannelDetails: String
    }
  `;
}
