import {
    ChannelService,
    LanguageCode,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
    User,
} from '@vendure/core';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextStrategy {
    constructor(
        private connection: TransactionalConnection,
        private requestContextService: RequestContextService,
        private channelService: ChannelService,
    ) { }

    async createRequestContext(channelToken?: string): Promise<RequestContext> {
        try {
            const admin = await this.connection.rawConnection
                .getRepository(User)
                .findOne({ where: { identifier: 'superadmin' } });

            if (!admin) {
                throw new Error('No admin user found');
            }

            const defaultChannel = await this.channelService.getDefaultChannel();

            return this.requestContextService.create({
                apiType: 'custom',
                languageCode: LanguageCode.pt_BR,
                channelOrToken: channelToken ? channelToken : defaultChannel.token,
                user: admin,
            });
        } catch (error) {
            throw new Error(error as string);
        }
    }
}
