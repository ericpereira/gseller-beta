import { Permission } from '@ericpereiraglobalsys/core';

export const defaultPermissions: Permission[] = [
    Permission.CreateCatalog,
    Permission.UpdateCatalog,
    Permission.ReadCatalog,
    Permission.DeleteCatalog,
    Permission.CreateOrder,
    Permission.ReadOrder,
    Permission.UpdateOrder,
    Permission.DeleteOrder,
    Permission.ReadCustomer,
    Permission.ReadPaymentMethod,
    Permission.ReadShippingMethod,
    Permission.ReadCountry,
    Permission.ReadZone,
    Permission.CreateCustomer,
    Permission.UpdateCustomer,
    Permission.DeleteCustomer,
    Permission.CreateTag,
    Permission.ReadTag,
    Permission.UpdateTag,
    Permission.DeleteTag,
    Permission.ReadAsset,
    Permission.UpdateAsset,
    Permission.DeleteAsset,
    Permission.CreateAsset,
    Permission.CreateFacet,
    Permission.ReadFacet,
    Permission.UpdateFacet,
    Permission.DeleteFacet,
    Permission.CreateProduct,
    Permission.ReadProduct,
    Permission.UpdateProduct,
    Permission.DeleteProduct,
    Permission.CreatePromotion,
    Permission.ReadPromotion,
    Permission.UpdatePromotion,
    Permission.DeletePromotion,
    Permission.ReadChannel,
    Permission.UpdateChannel,
]