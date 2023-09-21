import { Query, Resolver } from '@nestjs/graphql';

import { Allow } from '@gseller/core';
import { ContactService } from './contact.service';
import { ContactUsTdo } from './dto';
import { manageContact } from './contact.permission';

@Resolver()
export class ContactAdminResolver {

  constructor(
    private contactService: ContactService
  ) { }

  @Query()
  @Allow(manageContact.Read)
  async getAllRequestContact(): Promise<ContactUsTdo[]> {
    return this.contactService.getAllRequestContact();
  }
}
