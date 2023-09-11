import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
declare module '@vendure/common/lib/generated-types' {
    export class CreateShopAdministratorInput {
        @IsString()
        firstName: string;

        @IsString()
        lastName: string;

        @IsEmail()
        emailAddress: string;

        @IsNotEmpty()
        password: string;
    }
}


