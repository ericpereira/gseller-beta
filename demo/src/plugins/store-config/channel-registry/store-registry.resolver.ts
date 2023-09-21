import { Args, Mutation, Resolver, ResolveField, Query } from '@nestjs/graphql';
import { StoreRegistryService } from './store-registry.service';
import { ShopNameConflictError } from '../../shared/graphql.errors';
import {
  Administrator,
  Ctx,
  EmailAddressConflictError,
  RequestContext,
  Transaction,
} from '@gseller/core';
import { Context } from '@nestjs/graphql';

import { CreateShopAdministratorInput } from '@gseller/common/lib/generated-types';

@Resolver()
export class StoreRegistryResolver {
  constructor(private channelService: StoreRegistryService) { }

  @Mutation()
  @Transaction()
  registerShop(
    @Ctx() ctx: RequestContext,
    @Context() context: any,
    @Args()
    args: {
      input: {
        brand: string;
        administrator: CreateShopAdministratorInput;
      };
    },
  ) {
    return this.channelService.registerNewSeller(args.input, context);
  }

  @Query()
  checkShopNameAvailability(@Ctx() ctx: RequestContext, @Args() args: { shopName: string }) {
    return this.channelService.checkShopNameAvailability(args.shopName);
  }

  @Query()
  getCurrentChannel(@Ctx() ctx: RequestContext) {
    return this.channelService.getChannel(ctx);
  }

  @ResolveField()
  __resolveType(value: Administrator | EmailAddressConflictError | ShopNameConflictError) {
    switch (value.constructor) {
      case Administrator:
        return 'Administrator';
      case EmailAddressConflictError:
        return 'EmailAddressConflictError';
      case ShopNameConflictError:
        return 'ShopNameConflictError';
    }

    return null;
  }
}
