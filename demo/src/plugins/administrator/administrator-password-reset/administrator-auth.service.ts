import {
  Administrator,
  EventBus,
  ID,
  NativeAuthStrategyError,
  PasswordResetEvent,
  PasswordResetVerifiedEvent,
  RequestContext,
  TransactionalConnection,
  UserService,
  isGraphQlErrorResult,
} from '@vendure/core';
import {
  PasswordResetTokenExpiredError,
  PasswordResetTokenInvalidError,
  PasswordValidationError,
  Success,
} from '../../shared/types/generated-shop-types';

import { AdministratorNotFoundError } from '../../shared/graphql.errors';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdministratorAvatarService {
  constructor(
    private connection: TransactionalConnection,
    private userService: UserService,
    private eventBus: EventBus,
  ) { }

  async requestPassword(
    ctx: RequestContext,
    emailAddress: string,
  ): Promise<NativeAuthStrategyError | Success | AdministratorNotFoundError> {
    const user = await this.userService.setPasswordResetToken(ctx, emailAddress);

    if (!user) {
      return {
        __typename: 'AdministratorNotFoundError',
        errorCode: 'ADMINISTRATOR_NOT_FOUND_ERROR',
        message: 'ADMINISTRATOR_NOT_FOUND_ERROR',
      };
    }

    this.eventBus.publish(new PasswordResetEvent(ctx, user));

    return {
      __typename: 'Success',
      success: true,
    };
  }

  async resetPassword(
    ctx: RequestContext,
    token: string,
    password: string,
  ): Promise<
    | Success
    | PasswordResetTokenExpiredError
    | PasswordResetTokenInvalidError
    | PasswordValidationError
    | AdministratorNotFoundError
  > {
    const result = await this.userService.resetPasswordByToken(ctx, token, password);

    if (isGraphQlErrorResult(result)) {
      return result;
    }

    const administrator = await this.findOneByUserId(ctx, result.id);

    if (!administrator) {
      return {
        __typename: 'AdministratorNotFoundError',
        errorCode: 'ADMINISTRATOR_NOT_FOUND_ERROR',
        message: 'ADMINISTRATOR_NOT_FOUND_ERROR',
      };
    }

    this.eventBus.publish(new PasswordResetVerifiedEvent(ctx, result));

    return {
      __typename: 'Success',
      success: true,
    }
  }

  private findOneByUserId(ctx: RequestContext, userId: ID): Promise<Administrator | null> {
    return this.connection
      .getRepository(ctx, Administrator)
      .createQueryBuilder('administrator')
      .leftJoinAndSelect('administrator.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('administrator.deletedAt is null')
      .getOne();
  }
}
