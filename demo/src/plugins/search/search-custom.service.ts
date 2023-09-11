import {
  Asset,
  Channel,
  ChannelService,
  CountryService,
  Product,
  ProductVariantAsset,
  TransactionalConnection,
} from '@vendure/core';
import { Filters, SortOptionsInput } from './dto/types';

import { Brackets } from 'typeorm';
import { ContextStrategy } from './context-auth-strategy';
import { Injectable } from '@nestjs/common';
import { SearchIndexItem } from '@vendure/core/dist/plugin/default-search-plugin/entities/search-index-item.entity';

@Injectable()
export class SearchCustomService {
  constructor(
    private connection: TransactionalConnection,
    private channelService: ChannelService,
    private countryService: CountryService,
    private contextStrategy: ContextStrategy,
  ) { }

  async findAll(term?: string, filter?: Filters, sort?: SortOptionsInput, take?: number, skip?: number) {
    const products = this.connection.rawConnection
      .getRepository(SearchIndexItem)
      .createQueryBuilder('search_index_item')
      .leftJoin(Channel, 'channel', 'channel.id = search_index_item.channelId')
      .leftJoin(Product, 'product', 'product.id = search_index_item.productId')
      .select([
        'search_index_item.languageCode as "languageCode"',
        'search_index_item.enabled as "enabled"',
        'search_index_item.productName as "productName"',
        'search_index_item.productId as "productId"',
        'search_index_item.productVariantName as "productVariantName"',
        'search_index_item.description as "description"',
        'search_index_item.productVariantId as "productVariantId"',
        'search_index_item.slug as "slug"',
        'search_index_item.price as "price"',
        'search_index_item.priceWithTax as "priceWithTax"',
        'search_index_item.facetIds as "facetIds"',
        'search_index_item.facetValueIds as "facetValueIds"',
        'search_index_item.collectionIds as "collectionIds"',
        'search_index_item.collectionSlugs as "collectionSlugs"',
        'search_index_item.channelIds as "channelIds"',
        'search_index_item.productPreview as "productPreview"',
        'search_index_item.productPreviewFocalPoint as "productPreviewFocalPoint"',
        'search_index_item.productVariantPreview as "productVariantPreview"',
        'search_index_item.productVariantPreviewFocalPoint as "productVariantPreviewFocalPoint"',
        'search_index_item.inStock as "inStock"',
        'search_index_item.productVariantAssetId as "productVariantAssetId"',
        'search_index_item.productInStock as "productInStock"',
        'search_index_item.productAssetId as "productAssetId"',
        'search_index_item.sku as "sku"',
      ])
      .where('channel.customFieldsEnable = :customFieldsEnable', {
        customFieldsEnable: true,
      })
      .andWhere('channel.id != :channelId', {
        channelId: (await this.channelService.getDefaultChannel()).id,
      })
      .andWhere('search_index_item.enabled = :enabled', {
        enabled: true,
      })

    if (filter?.productIds) {
      products.andWhere(
        new Brackets((qb) => {
          filter.productIds.forEach((productId, index) => {
            qb.orWhere(`search_index_item.productId = :productId${index}`, {
              [`productId${index}`]: `${productId}`,
            });
          });
        }),
      );
    }

    if (filter?.productVariantId) {
      products.andWhere(
        new Brackets((qb) => {
          filter.productVariantId.forEach((productVariantId, index) => {
            qb.orWhere(`search_index_item.productVariantId = :productVariantId${index}`, {
              [`productVariantId${index}`]: `${productVariantId}`,
            });
          });
        }),
      );
    }

    //sort by name
    if (term) {
      products.andWhere('search_index_item.productName ILIKE :term', {
        term: `${term}%`,
      });
    }

    if (filter?.languageCode) {
      products.andWhere('search_index_item.languageCode = :languageCode', {
        languageCode: filter.languageCode,
      });
    }

    if (filter?.collectionSlugs) {
      products.andWhere(
        new Brackets((qb) => {
          filter.collectionSlugs.forEach((collectionSlug, index) => {
            qb.orWhere(`search_index_item.collectionSlugs ILIKE :collectionSlug${index}`, {
              [`collectionSlug${index}`]: `%${collectionSlug}%`,
            });
          });
        }),
      );
    }

    //filter by country
    if (filter?.country) {
      filter?.country.forEach((country) => {
        products.orWhere('search_index_item.languageCode LIKE :country', {
          country: `${country}`,
        });
      });
    }

    //filter by price
    if (filter?.price) {
      products.andWhere('search_index_item.price >= :min', {
        min: filter.price.min,
      });

      products.andWhere('search_index_item.price <= :max', {
        max: filter.price.max,
      });
    }

    //Filter by facetValueIds
    if (filter?.facetValueIds) {
      filter?.facetValueIds.forEach((facetValueId) => {
        products.andWhere('search_index_item.facetValueIds ILIKE :facetValueId', {
          facetValueId: `%${facetValueId}%`,
        });
      });
    }

    //Filter by facetIds
    if (filter?.facetIds) {
      filter?.facetIds.forEach((facetId) => {
        products.andWhere('search_index_item.facetIds ILIKE :facetId', {
          facetId: `%${facetId}%`,
        });
      });
    }

    //sort by name
    if (sort?.name) {
      products.orderBy('search_index_item.productName', sort.name);
    }

    //sort by price
    if (sort?.price) {
      products.orderBy('search_index_item.price', sort.price);
    }

    //Get product preview with related asset
    products.addSelect((subQuery) => {
      return subQuery
        .select('asset.source')
        .from(ProductVariantAsset, 'productVariantAsset')
        .leftJoin(Asset, 'asset', 'asset.id = productVariantAsset.assetId')
        .where('productVariantAsset.productVariantId = search_index_item.productVariantId');
    }, 'productVariantPreview');

    //Get channel token
    products.addSelect((subQuery) => {
      return subQuery
        .select('channel.token')
        .from(Channel, 'channel')
        .where('channel.id = search_index_item.channelId');
    }, 'channelToken');

    products.addSelect((subQuery) => {
      return subQuery
        .select('channel.code')
        .from(Channel, 'channel')
        .where('channel.id = search_index_item.channelId');
    }, 'channelCode');

    products.limit(take ? take : undefined).offset(skip ? skip : undefined);

    const result = await products.getRawMany();

    return {
      items: result,
      totalItems: result.length,
    };
  }

  async getAllCountry() {
    const ctx = await this.contextStrategy.createRequestContext();

    const countries = await this.countryService.findAll(ctx);

    return {
      items: countries.items.sort((a, b) => a.name.localeCompare(b.name)),
      totalItems: countries.totalItems,
    };
  }
}
