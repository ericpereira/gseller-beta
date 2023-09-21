import { RequestContext, TransactionalConnection, Customer, CustomerService, ID, EntityNotFoundError } from '@gseller/core';
import { Injectable } from '@nestjs/common';
import { CustomAssetService } from '../../asset/asset.service';

@Injectable()
export class CustomerAssetService {
  constructor(
    private connection: TransactionalConnection,
    private customAssetService: CustomAssetService,
    private customerService: CustomerService,
  ) {}

  async getCustomerAssetsIds(userId: ID): Promise<{ id: ID; avatarId: ID; bannerId: ID } | undefined> {
    const customer: { id: ID; avatarId: ID; bannerId: ID } | undefined = await this.connection.rawConnection
      .createQueryBuilder(Customer, 'customer')
      .select('customer.id', 'id')
      .addSelect('customer."customFieldsAvatarid"', 'avatarId')
      .addSelect('customer."customFieldsBannerid"', 'bannerId')
      .where('customer."userId" = :userId', { userId })
      .getRawOne();

    return customer;
  }

  async applyCustomerAsset(ctx: RequestContext, file: any, assetType: 'avatar' | 'banner') {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new EntityNotFoundError('user', userId as any)
    }
    
    const customer = await this.getCustomerAssetsIds(userId);
    if (!customer) {
      throw new EntityNotFoundError('customer', customer as any)
    }
    const config = this.getConfig(assetType);
    const asset = await this.customAssetService.createUserAsset(ctx, file, [config.tag]);
    await this.customerService.update(ctx, {
      id: customer.id,
      customFields: {
        [config.field]: asset.id,
      },
    });
    if (customer[config.field]) {
      await this.customAssetService.removeOldAsset(ctx, customer[config.field]);
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
