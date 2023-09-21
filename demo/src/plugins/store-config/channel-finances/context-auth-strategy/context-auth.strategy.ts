import {
  Channel,
  RequestContext,
  RequestContextService,
  TransactionalConnection,
  User,
} from '@gseller/core';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ContextStrategy {

  constructor(
    private connection: TransactionalConnection,
    private requestContextService: RequestContextService,
  ) { }

  async createRequestContext(channel: Channel): Promise<RequestContext> {
    try {

      const admin = await this.connection.rawConnection
        .getRepository(User)
        .findOne({ where: { identifier: 'superadmin' } });

      if (!admin) {
        throw new Error('No admin user found');
      }

      return this.requestContextService.create({
        apiType: 'admin',
        languageCode: channel.defaultLanguageCode,
        channelOrToken: channel,
        user: admin
      })
    } catch (error) {
      throw new Error(error as string)
    }

  }
}
