import { LanguageCode } from "@ericpereiraglobalsys/core";

export type Filters = {
  productIds: [string];
  productVariantId: [string];
  collectionSlugs: [string];
  country: [number];
  price: {
    min: number;
    max: number;
  },
  score: {
    min: number;
    max: number;
  },
  facetValueIds: [Number];
  facetIds: [Number];
  languageCode: LanguageCode;
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type SortOptionsInput = {
  name?: SortOrder;
  price?: SortOrder;
};

export type SearchCustomInput = {
  filter?: Filters;
  term?: string;
  inStock?: boolean;
  skip?: number;
  take?: number;
  sort?: SortOptionsInput;
};
