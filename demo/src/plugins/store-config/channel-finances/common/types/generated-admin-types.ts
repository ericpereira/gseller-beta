import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { Channel } from '@vendure/core';

declare module '@vendure/common/lib/generated-types' {
    class DefaultBankAccount {

        @IsString()
        @MaxLength(30, { message: 'Account holder name must have a maximum of 30 characters' })
        holderName: string;

        @IsString()
        @MaxLength(3, { message: 'Bank code must have a maximum of 3 numeric characters' })
        bank: string;

        @IsString()
        @MaxLength(4, { message: 'Branch number must have a maximum of 4 characters' })
        branchNumber: string;

        @IsString()
        @MaxLength(1, { message: 'Branch check digit must have a maximum of 1 numeric character' })
        branchCheckDigit: string;

        @IsString()
        @MaxLength(13, { message: 'Account number must have a maximum of 13 numeric characters' })
        accountNumber: string;

        @IsString()
        @MaxLength(2, { message: 'Account check digit must have a maximum of 2 numeric characters' })
        accountCheckDigit: string;

        @IsString()
        @IsNotEmpty()
        holderType: 'individual' | 'company';

        @IsString()
        @MaxLength(16, { message: 'Account holder document number must have a maximum of 16 characters' })
        holderDocument: string;

        @IsString()
        @IsNotEmpty()
        type: 'savings' | 'checking';
    }

    class PaymentAccountInput {

        @IsString()
        id: string;

        @IsString()
        @MaxLength(128, { message: 'Receiver name must have a maximum of 128 characters' })
        name: string;

        @IsEmail()
        @MaxLength(64, { message: 'Recipient e-mail must have a maximum of 64 characters' })
        email: string;

        @IsString()
        @MaxLength(256, { message: 'Description of the recipient must have a maximum of 256 characters' })
        description: string;

        @IsString()
        @MaxLength(16, { message: 'CPF or CNPJ of the recipient must have a maximum of 16 characters' })
        document: string;

        @IsString()
        @IsNotEmpty()
        type: 'individual' | 'company';

        @IsString()
        @IsNotEmpty()
        code: string;

        @IsNotEmpty()
        channel: Channel;

        defaultBankAccount: DefaultBankAccount;
    }

    class AccountHolderInput {
        @IsNotEmpty()
        documentNumber: string

        @IsString()
        legalName?: string
    }

    class UpdateAccountHolderInput {
        @IsString()
        documentNumber?: string

        @IsString()
        legalName?: string
    }

    class RecipientContractInput {
        @IsString()
        @IsNotEmpty()
        recipientId: string

        @IsNotEmpty()
        channelBankAccountId: string

        @IsNotEmpty()
        owner: {
            name: string
            emailAddress: string
        }

        @IsNotEmpty()
        channel: Channel;

    }

}




