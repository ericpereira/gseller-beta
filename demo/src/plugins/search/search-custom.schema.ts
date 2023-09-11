import gql from 'graphql-tag';

export default function SearchCustomSchema() {
  const searchCustomSchema = gql`
    input PriceRangeInput {
      min: Int
      max: Int
    }

    input Filters {
      productIds: [String]
      productVariantId: [String]
      collectionSlugs: [String]
      country: [LanguageCode]
      price: PriceRangeInput
      facetValueIds: [ID]
      facetIds: [ID]
      languageCode: LanguageCode
    }

    input SortOptionsInput {
      name: SortOrder
      price: SortOrder
    }

    input SearchCustomInput {
      filter: Filters
      term: String
      skip: Int
      take: Int
      sort: SortOptionsInput
    }

    type SensorMapSearchCustom implements Node {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      product: Product
      fraganceAroma: Float
      fraganceAromaDry: Float
      fraganceAromaBreak: Float
      flavor: Float
      aftertaste: Float
      acidity: Float
      acidityIntensity: Float
      balance: Float
      body: Float
      bodyLevel: Float
      uniformity: Float
      cleanCup: Float
      sweetness: Float
      overall: Float
      defectsNumberOfCups: Int
      defectsIntensity: Float
    }

    type MultiSearchResult {
      languageCode: LanguageCode
      enabled: Boolean
      productName: String
      productId: Float
      productVariantName: String
      description: String
      productVariantId: Float
      slug: String
      price: Float
      priceWithTax: Float
      productPreview: String
      productPreviewFocalPoint: String
      productVariantPreview: String
      productVariantPreviewFocalPoint: String
      inStock: Boolean
      productInStock: Boolean
      channelToken: String
      channelCode: String
      productAssetId: Float
      productVariantAssetId: Float
      sku: String
      score: Float
    }

    type CountryDetails {
      id: Int
      name: String
      code: String
      LanguageCode: String
    }

    type CountryResult {
      items: [CountryDetails!]
      totalItems: Int!
    }

    type MultiSearchResponse {
      items: [MultiSearchResult!]!
      totalItems: Int!
    }

    extend type Query {
      getAllCountry: CountryResult
      multiSearch(input: SearchCustomInput!): MultiSearchResponse
    }
  `;

  return searchCustomSchema;
}
