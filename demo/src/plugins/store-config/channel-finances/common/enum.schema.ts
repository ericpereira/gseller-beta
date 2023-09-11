import { gql } from 'graphql-tag';

export const ChannelPaymentAccount = gql`
  type ChannelPaymentAccount {
    id: String
    bankCode: String
    branchNumber: String
    branchCheckDigit: String
    accountNumber: String
    accountCheckDigit: String
    type: String
    inAnalysis: Boolean
    channel: Channel
    accountHolder: AccountHolder
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime
}
`;

export const AccountHolder = gql`
  type AccountHolder {
    id: String
    documentNumber: String
    legalName: String
    holderType: String
    channel: Channel
    createdAt: DateTime
    updatedAt: DateTime
    deletedAt: DateTime
  }
`