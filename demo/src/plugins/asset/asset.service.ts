import { AssetService, ID, RequestContext, isGraphQlErrorResult } from '@ericpereiraglobalsys/core';

import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomAssetService {
  constructor(private assetService: AssetService) { }

  async createUserAsset(ctx: RequestContext, file: any, tags: string[] = []) {
    const asset = await this.assetService.create(ctx, {
      file,
      tags,
    });

    if (isGraphQlErrorResult(asset)) {
      throw asset;
    }

    return asset;
  }

  async removeOldAsset(ctx: RequestContext, assetId: ID) {
    await this.assetService.delete(ctx, [assetId]);
  }
}
