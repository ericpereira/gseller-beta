import gql from "graphql-tag";

export default function AdminSchema(){
    const adminSchema = gql`
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
            nfePdfId: ID!
            assets: [ID]
        }

        input UpdateRefundRequestInput {
            customerId: ID
            orderId: ID
            paymentId: ID
            status: String
            nfeKey: String
            reason: String
            nfePdf: Upload
            assets: [Upload]
        }

        extend type Query {
            getAllRefundRequest(customerId: ID): [RefundRequest!]!
            getRefundRequest(id: ID!): RefundRequest!
        }

        extend type Mutation {
            createRefundRequest(input: CreateRefundRequestInput!): RefundRequest!
            updateRefundRequest(id: ID!, input: UpdateRefundRequestInput!): Boolean!
            deleteRefundRequest(id: ID!): Boolean!
        }
    `

    return adminSchema
}