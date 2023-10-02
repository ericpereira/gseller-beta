import { NativeAuthenticationStrategy, VendureConfig } from '@ericpereiraglobalsys/core';

import { ShortMessageAuthenticationStrategy } from '../strategy/authentication/authenticate';

export const authOptions: VendureConfig['authOptions'] = {
    tokenMethod: "bearer",
    requireVerification: false,
    superadminCredentials: {
        identifier: process.env.SUPERADMIN_USERNAME || "superadmin",
        password: process.env.SUPERADMIN_PASSWORD || "superadmin",
    },
    shopAuthenticationStrategy: [
        new NativeAuthenticationStrategy(),
        new ShortMessageAuthenticationStrategy(),
    ],
    adminAuthenticationStrategy: [
        new NativeAuthenticationStrategy(),
    ]
}