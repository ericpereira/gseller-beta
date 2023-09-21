import {
  AuthenticationStrategy,
  ExternalAuthenticationService,
  Injector,
  RequestContext,
  TransactionalConnection,
  User,
} from '@gseller/core';

import { DocumentNode } from 'graphql';
import { FindOneOptions } from 'typeorm';
import { TempSms } from '../../plugins/shared/messaging/sms/entities/sms-temp.entity';
import gql from 'graphql-tag';

export type ShortMessageServiceAuthData = {
  code: string;
};

export class ShortMessageAuthenticationStrategy implements AuthenticationStrategy<ShortMessageServiceAuthData> {
  readonly name = 'ShortMessageService';
  private externalAuthenticationService: ExternalAuthenticationService;
  private connection: TransactionalConnection;

  constructor() { }

  init(injector: Injector) {
    this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
    this.connection = injector.get(TransactionalConnection);
  }

  defineInputType(): DocumentNode {
    return gql`
        input SmsAuthInput {
          code: String
        }
      `;
  }

  async authenticate(ctx: RequestContext, data: ShortMessageServiceAuthData): Promise<any | false> {

    const options: FindOneOptions<TempSms> = {
      where: {
        code: data.code as string,
      },
    };


    const codeTemp = await this.connection
      .rawConnection
      .getRepository(TempSms)
      .findOne(options);

    if (!codeTemp) {
      // If no user was found, we need to create a new User and Customer based ;
      throw new Error('Code not found');
    }

    const user = await this.connection.rawConnection.getRepository(User).findOne({
      where: {
        id: codeTemp.userId as string,
      },
    });

    if (user) {
      await this.connection.rawConnection.getRepository(TempSms).delete({
        code: data.code,
      });
    }

    return user;
  }
}
