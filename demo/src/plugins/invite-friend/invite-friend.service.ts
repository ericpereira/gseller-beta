import { AdministratorService, Ctx, EventBus, RequestContext, TransactionalConnection } from '@ericpereiraglobalsys/core';
import { Injectable } from '@nestjs/common';
//@ts-ignore 
import { InviteFriendEvent } from '../events/event-bus/invite-friend-event';

@Injectable()
export class InviteFriendService {

  constructor(
    private eventBus: EventBus,
    private administratorService: AdministratorService
  ) { }

  async InviteFriend(
    @Ctx() ctx: RequestContext,
    { emailAddress }: {
      emailAddress: string;
    }
  ) {
    const { activeUserId } = ctx

    if (!emailAddress || !ctx.activeUserId) {
      return {
        success: false,
        message: !emailAddress ? 'emailAddress is required' : 'Product not found'
      };
    }
    const product = await this.administratorService.findOneByUserId(ctx, activeUserId!);

    this.eventBus.publish(
      new InviteFriendEvent(
        ctx, {
        emailAddress,
        guest: product?.firstName + ' ' + product?.lastName,
        url: process.env.FARMLY_URL as string
      },
      ),
    );

    return {
      message: 'Invitation sent successfully, please check your email',
      success: true
    };
  }
}
