import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@gseller/core';

import { AdministratorAvatarService } from './administrator-auth.service';
import { AdministratorNotFoundError } from '../../shared/graphql.errors';

import {
  PasswordResetTokenExpiredError,
  PasswordResetTokenInvalidError,
  PasswordValidationError,
  RequestPasswordResetResult,
  Success
} from '../../shared/types/generated-shop-types';

@Resolver()
export class AdministratorAvatarResolver {
  constructor(private administratorAvatarService: AdministratorAvatarService) { }

  @Mutation()
  async requestPasswordReset(
    @Ctx() ctx: RequestContext,
    @Args() args: { emailAddress: string },
  ): Promise<RequestPasswordResetResult | AdministratorNotFoundError> {
    return this.administratorAvatarService.requestPassword(ctx, args.emailAddress);
  }

  @Mutation()
  async resetPassword(
    @Ctx() ctx: RequestContext,
    @Args() args: { token: string; password: string },
  ): Promise<
    | Success
    | PasswordResetTokenExpiredError
    | PasswordResetTokenInvalidError
    | PasswordValidationError
    | AdministratorNotFoundError
  > {
    return this.administratorAvatarService.resetPassword(ctx, args.token, args.password);
  }

}
