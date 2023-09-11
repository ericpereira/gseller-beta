import { AccountHolder, ChannelPaymentAccount } from '../common/enum.schema';

import gql from 'graphql-tag';

export const adminApiExtensions = gql`

${ChannelPaymentAccount}
${AccountHolder}

type CannotDeleteAccountHolderError {
      errorCode: String!
      message: String!
}

type DocumentNumberConflictError  {
      errorCode: String!
      message: String!
}

type BankAccountNotFoundError {
      errorCode: String!
      message: String!
}

type ChannelNotFoundError {
      errorCode: String!
      message: String!
}

type BankAccountList {
  items: [ChannelPaymentAccount!]!
  totalItems: Int!
}

type AccountHolderAlreadyExistsError {
  errorCode: String!
  message: String!
}

type AccountHolderNotFoundError {
  errorCode: String!
  message: String!
}

input ChannelPaymentAccountInput {
  bankCode: String!
  branchNumber: String!
  branchCheckDigit: String
  accountNumber: String!
  accountCheckDigit: String!
  type: String!
}

input UpdateChannelPaymentAccountInput {
  bankCode: String
  branchNumber: String
  branchCheckDigit: String
  accountNumber: String
  accountCheckDigit: String
  type: String
}

input AccountHolderInput {
  documentNumber: String!
  legalName: String
  holderType: String
}

input UpdateAccountHolderInput {
  documentNumber: String!
  legalName: String
}

union ChannelPaymentAccountResult = ChannelPaymentAccount | DocumentNumberConflictError | ChannelNotFoundError | BankAccountNotFoundError
union ChannelPaymentAccountDeleteResult = BankAccountNotFoundError | Success | CannotDeleteAccountHolderError
union ChannelPaymentAccountUpdateResult = ChannelPaymentAccount | BankAccountNotFoundError | ChannelNotFoundError
union CreateAccountHolderResult = AccountHolder | AccountHolderAlreadyExistsError
union UpdateAccountHolderResult = AccountHolder | DocumentNumberConflictError | AccountHolderNotFoundError

extend type Query {
  channelCurrentPaymentAccount: ChannelPaymentAccountUpdateResult 
  getAllBankAccounts: BankAccountList
  channelCurrentAccountHolder: AccountHolder
}

extend type Mutation {
    createChannelPaymentAccount(input: ChannelPaymentAccountInput!): ChannelPaymentAccountResult
    updateChannelPaymentAccount(input: UpdateChannelPaymentAccountInput!): ChannelPaymentAccount
    deleteChannelPaymentAccount(id: ID!): ChannelPaymentAccountDeleteResult

    createAccountHolder(input: AccountHolderInput!): CreateAccountHolderResult
    updateAccountHolder(input: UpdateAccountHolderInput!):  UpdateAccountHolderResult
    # deleteAccountHolder(id: ID!): Success
}
`;
