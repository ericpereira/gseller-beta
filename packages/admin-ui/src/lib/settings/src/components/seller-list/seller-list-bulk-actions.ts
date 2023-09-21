import { createBulkDeleteAction, GetSellersQuery, ItemOf, Permission } from '@gseller/admin-ui/core';
import { map } from 'rxjs/operators';

export const deleteSellersBulkAction = createBulkDeleteAction<ItemOf<GetSellersQuery, 'sellers'>>({
    location: 'seller-list',
    requiresPermission: userPermissions => userPermissions.includes(Permission.DeleteSeller),
    getItemName: item => item.name,
    bulkDelete: (dataService, ids) =>
        dataService.settings.deleteSellers(ids).pipe(map(res => res.deleteSellers)),
});
