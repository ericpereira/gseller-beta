import { VendureConfig } from '@gseller/core';
import path from 'path';

export const dbConnectionOptions: VendureConfig['dbConnectionOptions'] = {
    type: 'postgres',
    synchronize: false,
    migrations: [path.join(__dirname, '../migrations/*.+(js|ts)')],
    logging: false,
    database: process.env.DB_NAME,
    // schema: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    port: process.env?.DB_PORT ? process.env.DB_PORT : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
};
