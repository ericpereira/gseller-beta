
declare module '@vendure/core/dist/entity/custom-entity-fields' {
  interface ICustomSellerFields {
    connectedAccountId: string;
  }

  interface CustomSellerFields extends ICustomSellerFields { }
}
