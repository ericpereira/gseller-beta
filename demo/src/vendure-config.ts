import "dotenv/config";

import { apiOptions, authOptions, dbConnectionOptions, plugins } from "./config";

import { VendureConfig } from "@vendure/core";

export const config: VendureConfig = {
    apiOptions,
    authOptions,
    dbConnectionOptions,
    customFields: {},
    plugins,
};
