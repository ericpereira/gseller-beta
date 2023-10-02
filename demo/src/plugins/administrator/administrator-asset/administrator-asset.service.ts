import { RequestContext, TransactionalConnection, Administrator, AdministratorService, ID } from '@ericpereiraglobalsys/core';
import { Injectable } from '@nestjs/common';
import { CustomAssetService } from '../../asset/asset.service';

@Injectable()
export class AdministratorAssetService {
  constructor(
    private connection: TransactionalConnection,
    private customAssetService: CustomAssetService,
    private administratorService: AdministratorService,
  ) {}

  async getAdministratorAssetsIds(userId: ID): Promise<{ id: ID; avatarId: ID; bannerId: ID } | undefined> {
    const adm: { id: ID; avatarId: ID; bannerId: ID } | undefined = await this.connection.rawConnection
      .createQueryBuilder(Administrator, 'adm')
      .select('adm.id', 'id')
      .addSelect('adm."customFieldsAvatarid"', 'avatarId')
      .addSelect('adm."customFieldsBannerid"', 'bannerId')
      .where('adm."userId" = :userId', { userId })
      .getRawOne();

    return adm;
  }

  async applyAdministratorAsset(ctx: RequestContext, file: any, assetType: 'avatar' | 'banner') {
    const userId = ctx.activeUserId;
    if (!userId) {
      return;
    }
    const administrator = await this.getAdministratorAssetsIds(userId);
    if (!administrator) {
      return;
    }
    const config = this.getConfig(assetType);
    const asset = await this.customAssetService.createUserAsset(ctx, file, [config.tag]);
    await this.administratorService.update(ctx, {
      id: administrator.id,
      customFields: {
        [config.field]: asset.id,
      },
    });
    if (administrator[config.field]) {
      await this.customAssetService.removeOldAsset(ctx, administrator[config.field]);
    }
    return asset;
  }

  private getConfig(assetType: 'avatar' | 'banner'): { field: 'avatarId' | 'bannerId'; tag: 'avatar' | 'banner' } {
    return {
      avatar: {
        field: 'avatarId',
        tag: 'avatar',
      },
      banner: {
        field: 'bannerId',
        tag: 'banner',
      },
    }[assetType] as any;
  }
}
