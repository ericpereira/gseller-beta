import "dotenv/config";

import { apiOptions, authOptions, dbConnectionOptions, paymentOptions, plugins } from "./config";

import { VendureConfig } from "@vendure/core";

export const config: VendureConfig = {
    apiOptions,
    authOptions,
    dbConnectionOptions,
    paymentOptions,
    customFields: {},
    plugins,
};
