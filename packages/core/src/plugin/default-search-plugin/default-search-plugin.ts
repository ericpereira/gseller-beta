import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { SearchReindexResponse } from '@ericpereiraglobalsys/common/lib/generated-types';
import { ID, Type } from '@ericpereiraglobalsys/common/lib/shared-types';
import { buffer, debounceTime, delay, filter, map } from 'rxjs/operators';
import { Column } from 'typeorm';

import { Injector } from '../../common';
import { idsAreEqual } from '../../common/utils';
import { EventBus } from '../../event-bus/event-bus';
import { AssetEvent } from '../../event-bus/events/asset-event';
import { JobQueueService } from '../../job-queue/job-queue.service';
import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { stockStatusExtension } from './api/api-extensions';
import { AdminFulltextSearchResolver, ShopFulltextSearchResolver } from './api/fulltext-search.resolver';
import { BUFFER_SEARCH_INDEX_UPDATES, PLUGIN_INIT_OPTIONS } from './constants';
import { SearchIndexItem } from './entities/search-index-item.entity';
import { FulltextSearchService } from './fulltext-search.service';
import { IndexerController } from './indexer/indexer.controller';
import { SearchIndexService } from './indexer/search-index.service';
import { SearchJobBufferService } from './search-job-buffer/search-job-buffer.service';
import { DefaultSearchPluginInitOptions } from './types';

export interface DefaultSearchReindexResponse extends SearchReindexResponse {
    timeTaken: number;
    indexedItemCount: number;
}

/**
 * @description
 * The DefaultSearchPlugin provides a full-text Product search based on the full-text searching capabilities of the
 * underlying database.
 *
 * The DefaultSearchPlugin is bundled with the `\@ericpereiraglobalsys/core` package. If you are not using an alternative search
 * plugin, then make sure this one is used, otherwise you will not be able to search products via the
 * [`search` query](/docs/graphql-api/shop/queries#search).
 *
 * {{% alert "warning" %}}
 * Note that the quality of the fulltext search capabilities varies depending on the underlying database being used. For example,
 * the MySQL & Postgres implementations will typically yield better results than the SQLite implementation.
 * {{% /alert %}}
 *
 *
 * @example
 * ```ts
 * import { DefaultSearchPlugin, VendureConfig } from '\@ericpereiraglobalsys/core';
 *
 * export const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     DefaultSearchPlugin.init({
 *       indexStockStatus: true,
 *       bufferUpdates: true,
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory core plugins/DefaultSearchPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        FulltextSearchService,
        SearchIndexService,
        IndexerController,
        SearchJobBufferService,
        { provide: PLUGIN_INIT_OPTIONS, useFactory: () => DefaultSearchPlugin.options },
        {
            provide: BUFFER_SEARCH_INDEX_UPDATES,
            useFactory: () => DefaultSearchPlugin.options.bufferUpdates === true,
        },
    ],
    adminApiExtensions: {
        schema: () =>
            DefaultSearchPlugin.options.indexStockStatus === true ? stockStatusExtension : undefined,
        resolvers: [AdminFulltextSearchResolver],
    },
    shopApiExtensions: {
        schema: () =>
            DefaultSearchPlugin.options.indexStockStatus === true ? stockStatusExtension : undefined,
        resolvers: [ShopFulltextSearchResolver],
    },
    entities: [SearchIndexItem],
    compatibility: '>0.0.0',
})
export class DefaultSearchPlugin implements OnApplicationBootstrap, OnApplicationShutdown {
    static options: DefaultSearchPluginInitOptions = {};

    /** @internal */
    constructor(
        private eventBus: EventBus,
        private searchIndexService: SearchIndexService,
        private jobQueueService: JobQueueService,
        private moduleRef: ModuleRef,
    ) {}

    static init(options: DefaultSearchPluginInitOptions): Type<DefaultSearchPlugin> {
        this.options = options;
        if (options.indexStockStatus === true) {
            this.addStockColumnsToEntity();
        }
        return DefaultSearchPlugin;
    }

    /** @internal */
    async onApplicationBootstrap() {
        this.eventBus.ofType(AssetEvent).subscribe(event => {
            if (event.type === 'updated') {
                return this.searchIndexService.updateAsset(event.ctx, event.asset);
            }
            if (event.type === 'deleted') {
                return this.searchIndexService.deleteAsset(event.ctx, event.asset);
            }
        });

        await this.initSearchStrategy();
    }

    /** @internal */
    async onApplicationShutdown(signal?: string) {
        await this.destroySearchStrategy();
    }

    private async initSearchStrategy(): Promise<void> {
        const injector = new Injector(this.moduleRef);
        const searchService = injector.get(FulltextSearchService);
        if (typeof searchService.searchStrategy.init === 'function') {
            await searchService.searchStrategy.init(injector);
        }
    }

    private async destroySearchStrategy(): Promise<void> {
        const injector = new Injector(this.moduleRef);
        const searchService = injector.get(FulltextSearchService);
        if (typeof searchService.searchStrategy.destroy === 'function') {
            await searchService.searchStrategy.destroy();
        }
    }

    /**
     * If the `indexStockStatus` option is set to `true`, we dynamically add a couple of
     * columns to the SearchIndexItem entity. This is done in this way to allow us to add
     * support for indexing the stock status, while preventing a backwards-incompatible
     * schema change.
     */
    private static addStockColumnsToEntity() {
        const instance = new SearchIndexItem();
        Column({ type: 'boolean', default: true })(instance, 'inStock');
        Column({ type: 'boolean', default: true })(instance, 'productInStock');
    }
}
