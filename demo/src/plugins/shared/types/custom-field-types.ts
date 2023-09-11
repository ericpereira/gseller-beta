
declare module '@vendure/core/dist/entity/custom-entity-fields' {
    class CustomFieldsSeller {
        connectedAccountId: string;
    }

    class CustomSellerFields implements CustomFieldsSeller { }
}
