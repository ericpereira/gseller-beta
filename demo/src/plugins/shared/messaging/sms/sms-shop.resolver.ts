import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { SmsService } from "./sms.service";

@Resolver()
export class SmsResolver {

    constructor(
        private SmsService: SmsService
    ) { }

    @Mutation()
    async requestCodeByPhone(
        @Args() args: {
            input: {
                phone: string
            }
        }
    ) {
        return this.SmsService.sendCode(args.input.phone);
    }

}