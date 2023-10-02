
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext } from '@ericpereiraglobalsys/core';
import { InviteFriendService } from './invite-friend.service';
import { BaseResult } from '../shared/types/generated-types';

@Resolver()
export class InviteFriendResolver {

  constructor(
    private inviteFriendService: InviteFriendService
  ) { }

  @Mutation()
  @Allow(Permission.Authenticated)
  async inviteFriendProducer(
    @Ctx() ctx: RequestContext,
    @Args() args: {
      emailAddress: string;
    }
  ): Promise<BaseResult> {
    return this.inviteFriendService.InviteFriend(ctx, args);
  }
}
