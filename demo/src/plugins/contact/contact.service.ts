import { Ctx, EventBus, RequestContext, TransactionalConnection } from '@ericpereiraglobalsys/core';
import { ContactUsTdo } from './dto';
import { Injectable } from '@nestjs/common';
import { Contact } from './entities/contact.entities';
import { ContactUsEvent } from '../../event-bus/events/contact-us-event';

@Injectable()
export class ContactService {

  constructor(
    private eventBus: EventBus,
    private connection: TransactionalConnection,
  ) { }

  async RequestContact(
    @Ctx() ctx: RequestContext,
    { input }: { input: ContactUsTdo }
  ) {

    if (!input.emailAddress) {
      return {
        message: 'emailAddress is required',
        success: false
      };
    }

    this.connection
      .rawConnection
      .getRepository(Contact)
      .save({
        ...input
      });

    this.eventBus.publish(
      new ContactUsEvent(
        ctx,
        input,
      ),
    );

    return {
      message: 'Contact request sent successfully',
      success: true
    };
  }

  async getAllRequestContact(): Promise<ContactUsTdo[]> {
    return this.connection
      .rawConnection
      .getRepository(Contact)
      .find();
  }
}
