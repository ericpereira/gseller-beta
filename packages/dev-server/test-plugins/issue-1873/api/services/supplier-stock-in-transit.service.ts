import { Injectable } from '@nestjs/common';
import type {
  ListQueryOptions,
  PaginatedList,
  RequestContext,
} from '@ericpereiraglobalsys/core';
import { ListQueryBuilder } from '@ericpereiraglobalsys/core';
import { SupplierStockInTransit } from '../../entities/supplier-stock-in-transit.entity';

@Injectable()
export class SupplierStockInTransitService {
  constructor(private readonly listQueryBuilder: ListQueryBuilder) {}

  findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<SupplierStockInTransit>
  ): Promise<PaginatedList<SupplierStockInTransit>> {
    return this.listQueryBuilder
      .build(SupplierStockInTransit, options, {
        ctx,
        relations: ['supplierStock', 'supplierStock.productVariant'],
      })
      .getManyAndCount()
      .then(([items, totalItems]) => {
        return {
          items,
          totalItems,
        };
      });
  }
}
