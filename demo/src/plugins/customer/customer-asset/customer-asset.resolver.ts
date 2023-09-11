// customer-avatar.resolver.ts
import { Args, Mutation, Resolver, ResolveField } from '@nestjs/graphql';
import { Allow, Asset, Asset as AssetEntity, Ctx, Permission, RequestContext, Transaction } from '@vendure/core';
import { Upload } from '../../shared/types/upload';
import { CustomerAssetService } from './customer-asset.service';

@Resolver('CreateAssetResult')
export class CustomerAssetResolver {
  constructor(private customerAssetService: CustomerAssetService) { }

  @Transaction()
  @Mutation()
  @Allow(Permission.Authenticated)
  async setCustomerAvatar(@Ctx() ctx: RequestContext, @Args('file') upload: Upload): Promise<Asset | undefined> {
    return this.customerAssetService.applyCustomerAsset(ctx, upload.file, 'avatar');
  }

  @ResolveField()
  __resolveType(value: any) {
    if (value instanceof AssetEntity) {
      return 'Asset';
    }
  }
}
