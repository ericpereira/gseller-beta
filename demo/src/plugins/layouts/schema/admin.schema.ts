import gql from "graphql-tag";

export default function AdminSchema(){
    const adminSchema = gql`
        type LayoutCategory {
            id: ID!
            title: String!
        }

        enum LayoutTypes {
            web
            mobile
        }

        type Layout {
            id: ID!
            webAssetId: ID
            mobileAssetId: ID
            isActive: Boolean!
            title: String
            description: String
            path: String
            type: LayoutTypes!
            price: Float!
            categories: [LayoutCategory]
            webAsset: Asset
            mobileAsset: Asset
        }

        input CreateLayoutInput {
            webAssetId: ID
            mobileAssetId: ID
            isActive: Boolean
            title: String!
            description: String
            path: String!
            type: LayoutTypes
            price: Float
            categories: [ID]
        }

        input UpdateLayoutInput {
            webAssetId: ID
            mobileAssetId: ID
            isActive: Boolean
            title: String
            description: String
            path: String
            type: LayoutTypes
            price: Float
            categories: [ID]
        }

        input CreateLayoutCategoryInput {
            title: String!
        }

        input SetChannelLayoutInput {
            layoutId: ID!
        }

        type InvalidData  {
            errorCode: String!
            message: String!
        }

        type LayoutCategoryInvalidID  {
            errorCode: String!
            message: String!
        }

        type LayoutInvalidID  {
            errorCode: String!
            message: String!
        }

        type LayoutCategoryTitleInvalid  {
            errorCode: String!
            message: String!
        }

        type LayoutTitleInvalid  {
            errorCode: String!
            message: String!
        }

        type InvalidLayoutPrice  {
            errorCode: String!
            message: String!
        }

        type LayoutInvalid  {
            errorCode: String!
            message: String!
        }

        type LayoutIDInvalid {
            errorCode: String!
            message: String!
        }

        type UpdateLayoutCategoryResult {
            success: Boolean!
            error: InvalidData
        }

        type UpdateLayoutResult {
            success: Boolean!
            error: ErrorsUpdateLayout
        }

        type DeleteLayoutCategoryResult {
            success: Boolean!
            error: LayoutCategoryInvalidID
        }

        type DeleteLayoutResult {
            success: Boolean!
            error: LayoutInvalidID
        }

        type SetLayoutResult {
            success: Boolean!
            error: ErrorsSetLayout
        }

        union CreateLayoutCategoryResult = LayoutCategoryTitleInvalid | LayoutCategory
        union GetLayoutCategoryResult = LayoutCategoryInvalidID | LayoutCategory
        union CreateLayoutResult = LayoutTitleInvalid | Layout
        union ErrorsUpdateLayout = LayoutTitleInvalid | InvalidLayoutPrice | LayoutInvalid
        union ErrorsSetLayout = LayoutIDInvalid | LayoutInvalid

        extend type Query {
            getAllLayoutCategory: [LayoutCategory!]!
            getLayoutCategory(id: ID!): GetLayoutCategoryResult

            getAllLayout: [Layout!]!
            getAllActiveLayout: [Layout!]!
            getLayout(id: ID!): Layout!

            getActiveLayout: Layout!
            getLayoutHistory: [Layout!]!
        }

        extend type Mutation {
            createLayoutCategory(input: CreateLayoutCategoryInput!): LayoutCategory!
            updateLayoutCategory(id: ID!, input: CreateLayoutCategoryInput!): UpdateLayoutCategoryResult
            deleteLayoutCategory(id: ID!): DeleteLayoutCategoryResult

            createLayout(input: CreateLayoutInput!): Layout!
            updateLayout(id: ID!, input: UpdateLayoutInput!): UpdateLayoutResult
            deleteLayout(id: ID!): Boolean!

            setChannelLayout(input: SetChannelLayoutInput): SetLayoutResult
        }
    `

    return adminSchema
}