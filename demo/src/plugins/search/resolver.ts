import { Args, Query, Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { Allow, Permission } from '@gseller/core';
import { SearchCustomService } from './search-custom.service';
import { SearchCustomInput } from './dto/types';
@Resolver()
@Resolver('SensorMapSearchCustom')
export class SearchCustomResolver {
  constructor(
    private searchCustomService: SearchCustomService,
  ) { }

  @Query()
  async multiSearch(@Args() args: { input: SearchCustomInput }) {
    return this.searchCustomService.findAll(
      args.input.term,
      args.input.filter,
      args.input.sort,
      args.input.take,
      args.input.skip,
    );
  }

  @Query()
  async getAllCountry() {
    return this.searchCustomService.getAllCountry();
  }

}
