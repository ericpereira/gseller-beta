import { PluginCommonModule, VendurePlugin } from "@gseller/core";

import { SmsResolver } from "./sms-shop.resolver";
import { SmsService } from "./sms.service";
import { TempSms as TempSmsEntity } from "./entities/sms-temp.entity";
import { gql } from 'graphql-tag';

@VendurePlugin({
    compatibility: "2.0.1",
    entities: [TempSmsEntity],
    imports: [PluginCommonModule],
    shopApiExtensions: {
        schema: gql`
            type requestCodeByPhoneResponse {
                success: Boolean
                message: String
            }

            input SmsInput {
                phone: String!
            }

            extend type Mutation {
                requestCodeByPhone(
                    input: SmsInput!
                ): requestCodeByPhoneResponse
            }
        `,
        resolvers: [SmsResolver],
    },
    providers: [SmsService],
})
export class SmsShopPlugin { }