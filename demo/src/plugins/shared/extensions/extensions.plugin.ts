import { VendurePlugin } from "@gseller/core";
import addressCustomFields from "./address-custom.fields";
import gql from "graphql-tag";
@VendurePlugin({
  compatibility: "2.0.5",
  adminApiExtensions: {
    schema: gql`
    
      type Error {
        message: String!
        errors: JSON
      }

      type GatewayRecipient {
        gateway: String
        status: String
        pgid: String
        createdAt: String
        updatedAt: String
      }

      type BankAccount {
        id: String
        holder_name: String
        holder_type: String
        holder_document: String
        bank: String
        branch_number: String
        branch_check_digit: String
        account_number: String
        account_check_digit: String
        type: String
        status: String
        created_at: String
        updated_at: String
        metadata: JSON
        geteway_recipients: [GatewayRecipient]
      }

      type TransferSettings {
        transfer_enabled: Boolean
        transfer_interval: String
        transfer_day: Int
      }

      type AutomaticAnticipationSettings {
        enabled: Boolean
        delay: Int
        type: String
        volume_percentage: Int
      }

      type Recipient {
        id: String
        name: String
        email: String
        document: String
        status: String
        type: String
        created_at: String
        updated_at: String
        description: String
        code: String
        default_bank_account: BankAccount
        transfer_settings: TransferSettings
        gateway_recipients: [GatewayRecipient]
        automatic_anticipation_settings: AutomaticAnticipationSettings
        metadata: JSON
      }

      input BankAccountInput {
        holder_name: String!
        bank: String!
        branch_number: String!
        account_number: String!
        account_check_digit: String!
        holder_document: String!
        holder_type: String!
        branch_check_digit: String
        type: String!
      }

      input TransferSettingsInput {
        transfer_enabled: Boolean
        transfer_interval: String
        transfer_day: Int
      }

      input AutomaticAnticipationSettingsInput {
        enabled: Boolean
        delay: String
        type: String
        volume_percentage: String
      }

      input CreateRecipientInput {
        name: String!
        email: String!
        document: String!
        type: String!
        description: String
        code: String
        default_bank_account: BankAccountInput!
        transfer_settings: TransferSettingsInput
        automatic_anticipation_settings: AutomaticAnticipationSettingsInput
        metadata: JSON
      }

      union CreateRecipientResponse = Recipient | Error
      
      type BaseResult {
        success: Boolean!
        message: String!
      }
    `
  },
  shopApiExtensions: {
    schema: gql`
      type BaseResult {
        success: Boolean!
        message: String!
      }
    `
  },
  configuration: (config) => {
    config.customFields.Address.push(...addressCustomFields);
    return config;
  },
})

export class ExtensionsPlugin { }