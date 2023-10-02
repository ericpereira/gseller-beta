// customer-avatar.resolver.ts
import { Args, Mutation, Resolver, ResolveField } from '@nestjs/graphql';
import { Allow, Asset, Asset as AssetEntity, Ctx, Permission, RequestContext, Transaction } from '@ericpereiraglobalsys/core';
import { Upload } from '../../shared/types/upload';
import { AdministratorAssetService } from './administrator-asset.service';

@Resolver('CreateAssetResult')
export class CustomerAssetResolver {
  constructor(private administratorAssetService: AdministratorAssetService) { }

  @Transaction()
  @Mutation()
  @Allow(Permission.Authenticated)
  async setAdministratorAvatar(@Ctx() ctx: RequestContext, @Args('file') upload: Upload): Promise<Asset | undefined> {
    return this.administratorAssetService.applyAdministratorAsset(ctx, upload.file, 'avatar');
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.Authenticated)
  async setAdministratorBanner(@Ctx() ctx: RequestContext, @Args('file') upload: Upload): Promise<Asset | undefined> {
    return this.administratorAssetService.applyAdministratorAsset(ctx, upload.file, 'banner');
  }

  @ResolveField()
  __resolveType(value: any) {
    if (value instanceof AssetEntity) {
      return 'Asset';
    }
  }
}
