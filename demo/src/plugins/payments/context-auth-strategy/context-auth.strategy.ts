import {
    Channel,
    ChannelService,
    LanguageCode,
    RequestContext,
    RequestContextService,
    RoleService,
    TransactionalConnection,
    User
} from '@gseller/core';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextStrategy {

    constructor(
        private connection: TransactionalConnection,
        private requestContextService: RequestContextService,
        private channelService: ChannelService,
    ) { }

    async createRequestContext(): Promise<RequestContext> {
        try {
            const admin = await
                this.connection
                    .rawConnection
                    .getRepository(User)
                    .findOne({ where: { identifier: "superadmin" } });

            if (!admin) {
                throw new Error("No admin user found");
            }

            const defaultChannel = await this.channelService.getDefaultChannel()

            return this.requestContextService.create({
                apiType: 'custom',
                languageCode: LanguageCode.pt_BR,
                channelOrToken: defaultChannel.token,
                user: admin
            })

        } catch (error) {
            console.log(error)
            throw new Error(error as string)
        }

    }

    async createRequestContextByChannelCode(code: String): Promise<RequestContext> {
        try {
            const admin = await
                this.connection
                    .rawConnection
                    .getRepository(User)
                    .findOne({ where: { identifier: "superadmin" } });

            if (!admin) {
                throw new Error("No admin user found");
            }

            const channel = await
                this.connection
                    .rawConnection
                    .getRepository(Channel)
                    .findOne({
                        where: {
                            customFields: {
                                regioncode: code
                            }
                        }
                    })

            if (!channel) {
                throw new Error("No channel found");
            }

            return this.requestContextService.create({
                apiType: 'custom',
                languageCode: (await this.channelService.getDefaultChannel()).defaultLanguageCode,
                channelOrToken: channel,
                user: admin
            })
        } catch (error) {
            throw new Error(error as string)
        }

    }


}
