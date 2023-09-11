import gql from "graphql-tag";

export default function ShopSchema(){
    const shopSchema = gql`
    type RefundRequest {
        id: ID
        customerId: ID
        orderId: ID
        paymentId: ID
        channelId: ID
        nfePdfId: ID
        status: String
        reason: String
        nfePdf: Asset
        createdAt: String
        updatedAt: String
        customer: Customer
        order: Order
        payment: Payment
        channel: Channel
        assets: [Asset]
    }

    input CreateRefundRequestInput {
        orderCode: String!
        nfeKey: String!
        reason: String
        nfePdf: Upload
        assets: [Upload]
    }

    extend type Query {
        getAllRefundRequest: [RefundRequest!]!
        getRefundRequest(id: ID!): RefundRequest!
    }

    extend type Mutation {
        createRefundRequest(input: CreateRefundRequestInput!): RefundRequest!
        deleteRefundRequest(id: ID!): Boolean!
        uploadFile(file: Upload!): Asset
    }
    `

    return shopSchema
}