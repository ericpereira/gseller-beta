
import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core';
import { ContactService } from './contact.service';
import { ContactUsTdo } from './dto';

@Resolver()
export class ContactShopResolver {

  constructor(
    private contactService: ContactService
  ) { }

  @Mutation()
  async requestContact(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: ContactUsTdo }
  ): Promise<any> {
    return this.contactService.RequestContact(ctx, args);
  }
}
