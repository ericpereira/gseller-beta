import { Inject, Injectable } from '@nestjs/common';
import { LanguageCode } from '@ericpereiraglobalsys/common/lib/generated-types';
import { ID } from '@ericpereiraglobalsys/common/lib/shared-types';
import { unique } from '@ericpereiraglobalsys/common/lib/unique';
import { Observable } from 'rxjs';
import { In, IsNull } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { AsyncQueue } from '../../../common/async-queue';
import { Translatable, Translation } from '../../../common/types/locale-types';
import { asyncObservable, idsAreEqual } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { PLUGIN_INIT_OPTIONS } from '../constants';
import { SearchIndexItem } from '../entities/search-index-item.entity';
import {
    DefaultSearchPluginInitOptions,
    ProductChannelMessageData,
    ReindexMessageData,
    ReindexMessageResponse,
    UpdateAssetMessageData,
    UpdateProductMessageData,
    UpdateVariantMessageData,
    UpdateVariantsByIdMessageData,
    VariantChannelMessageData,
} from '../types';

import { MutableRequestContext } from './mutable-request-context';
import { Customer } from '../../../entity/customer/customer.entity';


export const BATCH_SIZE = 1000;
export const productRelations = ['featuredAsset', 'channels'];
export const customerRelations = [
    'user',
    'channels',
];

export const workerLoggerCtx = 'DefaultSearchPlugin Worker';

@Injectable()
export class IndexerController {
    private queue = new AsyncQueue('search-index');

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private requestContextCache: RequestContextCacheService,
        @Inject(PLUGIN_INIT_OPTIONS) private options: DefaultSearchPluginInitOptions,
    ) {}

    reindex({ ctx: rawContext }: ReindexMessageData): Observable<ReindexMessageResponse> {
        const ctx = MutableRequestContext.deserialize(rawContext);
        return asyncObservable(async observer => {
            const timeStart = Date.now();
            const qb = this.getSearchIndexQueryBuilder(ctx, ctx.channelId);
            const count = await qb.getCount();
            Logger.verbose(`Reindexing ${count} variants for channel ${ctx.channel.code}`, workerLoggerCtx);
            const batches = Math.ceil(count / BATCH_SIZE);

            await this.connection
                .getRepository(ctx, SearchIndexItem)
                .delete({ languageCode: ctx.languageCode, channelId: ctx.channelId });
            Logger.verbose('Deleted existing index items', workerLoggerCtx);

            // for (let i = 0; i < batches; i++) {
            //     Logger.verbose(`Processing batch ${i + 1} of ${batches}`, workerLoggerCtx);

            //     const variants = await qb
            //         .take(BATCH_SIZE)
            //         .skip(i * BATCH_SIZE)
            //         .getMany();
            //     await this.saveVariants(ctx, variants);
            //     observer.next({
            //         total: count,
            //         completed: Math.min((i + 1) * BATCH_SIZE, count),
            //         duration: +new Date() - timeStart,
            //     });
            // }
            Logger.verbose('Completed reindexing', workerLoggerCtx);

            return {
                total: count,
                completed: count,
                duration: +new Date() - timeStart,
            };
        });
    }

    async updateAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const id = data.asset.id;
        const ctx = MutableRequestContext.deserialize(data.ctx);

        function getFocalPoint(point?: { x: number; y: number }) {
            return point && point.x && point.y ? point : null;
        }

        const focalPoint = getFocalPoint(data.asset.focalPoint);
        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productAssetId: id }, { productPreviewFocalPoint: focalPoint });
        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productVariantAssetId: id }, { productVariantPreviewFocalPoint: focalPoint });
        return true;
    }

    async deleteAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const id = data.asset.id;
        const ctx = MutableRequestContext.deserialize(data.ctx);

        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productAssetId: id }, { productAssetId: null });
        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productVariantAssetId: id }, { productVariantAssetId: null });
        return true;
    }


    //TODO: Essa busca é utilizada em vários locais, como os produtos foram removidos, deixei buscando pelo Customer só pra manter esse
    //código aqui e usarmos para outra entidade mais genérica
    private getSearchIndexQueryBuilder(ctx: RequestContext, channelId: ID) {
        const qb = this.connection
            .getRepository(ctx, Customer)
            .createQueryBuilder('customer')
            .setFindOptions({
                relations: customerRelations,
                loadEagerRelations: true,
            })
            .leftJoin('customer.channels', 'channel')
            .where('channel.id = :channelId', { channelId })
        return qb;
    }

}
