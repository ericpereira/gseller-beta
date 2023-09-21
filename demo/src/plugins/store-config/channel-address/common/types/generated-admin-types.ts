import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

declare module '@gseller/common/lib/generated-types' {
    class ChannelAddressInput {
        @IsString()
        fullName: string;

        company: string;

        @IsNotEmpty()
        @IsString()
        streetLine1: string;

        streetLine2: string;

        @IsString()
        @IsNotEmpty()
        city: string;

        @IsNotEmpty()
        province: string;

        @IsNotEmpty()
        postalCode: string;

        @IsNotEmpty()
        country: string;

        phoneNumber: string;

        channelId: string;

        @IsNotEmpty()
        distributionCenter: boolean;

        @IsNotEmpty()
        neighborhood: string;

        @IsString()
        number: string;
    }

}




