import { INestApplicationContext } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';
import { lastValueFrom } from 'rxjs';

const loggerCtx = 'Populate';

/* eslint-disable no-console */
/**
 * @description
 * Populates the Vendure server with some initial data and (optionally) product data from
 * a supplied CSV file. The format of the CSV file is described in the section
 * [Importing Product Data](/docs/developer-guide/importing-product-data).
 *
 * If the `channelOrToken` argument is provided, all ChannelAware entities (Products, ProductVariants,
 * Assets, ShippingMethods, PaymentMethods etc.) will be assigned to the specified Channel.
 * The argument can be either a Channel object or a valid channel `token`.
 *
 * Internally the `populate()` function does the following:
 *
 * 1. Uses the {@link Populator} to populate the {@link InitialData}.
 * 2. If `productsCsvPath` is provided, uses {@link Importer} to populate Product data.
 * 3. Uses {@Populator} to populate collections specified in the {@link InitialData}.
 *
 * @example
 * ```TypeScript
 * import { bootstrap } from '\@ericpereiraglobalsys/core';
 * import { populate } from '\@ericpereiraglobalsys/core/cli';
 * import { config } from './vendure-config.ts'
 * import { initialData } from './my-initial-data.ts';
 *
 * const productsCsvFile = path.join(__dirname, 'path/to/products.csv')
 *
 * populate(
 *   () => bootstrap(config),
 *   initialData,
 *   productsCsvFile,
 * )
 * .then(app => app.close())
 * .then(
 *   () => process.exit(0),
 *   err => {
 *     console.log(err);
 *     process.exit(1);
 *   },
 * );
 * ```
 *
 * @docsCategory import-export
 */
export async function populate<T extends INestApplicationContext>(
    bootstrapFn: () => Promise<T | undefined>,
    initialDataPathOrObject: string | object,
    productsCsvPath?: string,
    channelOrToken?: string | import('@ericpereiraglobalsys/core').Channel,
): Promise<T> {
    const app = await bootstrapFn();
    if (!app) {
        throw new Error('Could not bootstrap the Vendure app');
    }
    let channel: import('@ericpereiraglobalsys/core').Channel | undefined;
    const { ChannelService, Channel, Logger } = await import('@ericpereiraglobalsys/core');
    if (typeof channelOrToken === 'string') {
        channel = await app.get(ChannelService).getChannelFromToken(channelOrToken);
        if (!channel) {
            Logger.warn(
                `Warning: channel with token "${channelOrToken}" was not found. Using default Channel instead.`,
                loggerCtx,
            );
        }
    } else if (channelOrToken instanceof Channel) {
        channel = channelOrToken;
    }
    const initialData: import('@ericpereiraglobalsys/core').InitialData =
        typeof initialDataPathOrObject === 'string'
            ? require(initialDataPathOrObject)
            : initialDataPathOrObject;

    await populateInitialData(app, initialData, channel);

    Logger.info('Done!', loggerCtx);
    return app;
}

export async function populateInitialData(
    app: INestApplicationContext,
    initialData: import('@ericpereiraglobalsys/core').InitialData,
    channel?: import('@ericpereiraglobalsys/core').Channel,
) {
    const { Populator, Logger } = await import('@ericpereiraglobalsys/core');
    const populator = app.get(Populator);
    try {
        await populator.populateInitialData(initialData, channel);
        Logger.info('Populated initial data', loggerCtx);
    } catch (err: any) {
        Logger.error(err.message, loggerCtx);
    }
}

