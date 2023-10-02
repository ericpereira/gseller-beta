import { Permission } from '@ericpereiraglobalsys/core';
import { customPermissions } from './custom.permissions'
import { defaultPermissions } from './default.permissions';

export const permissions: Permission[] = [
    ...defaultPermissions,
    ...customPermissions,
]