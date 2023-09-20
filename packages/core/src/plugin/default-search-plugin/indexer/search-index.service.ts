import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { Observable } from 'rxjs';

import { RequestContext } from '../../../api/common/request-context';
import { Logger } from '../../../config/logger/vendure-logger';
import { Asset } from '../../../entity/asset/asset.entity';
import { Job } from '../../../job-queue/job';
import { JobQueue } from '../../../job-queue/job-queue';
import { JobQueueService } from '../../../job-queue/job-queue.service';
import { ReindexMessageResponse, UpdateIndexQueueJobData } from '../types';

import { IndexerController } from './indexer.controller';

/**
 * This service is responsible for messaging the {@link IndexerController} with search index updates.
 */
@Injectable()
export class SearchIndexService implements OnApplicationBootstrap {
    private updateIndexQueue: JobQueue<UpdateIndexQueueJobData>;

    constructor(private jobService: JobQueueService, private indexerController: IndexerController) {}

    async onApplicationBootstrap() {
        this.updateIndexQueue = await this.jobService.createQueue({
            name: 'update-search-index',
            process: job => {
                const data = job.data;
                switch (data.type) {
                    case 'reindex':
                        Logger.verbose('sending ReindexMessage');
                        return this.jobWithProgress(job, this.indexerController.reindex(data));
                    case 'update-asset':
                        return this.indexerController.updateAsset(data);
                    case 'delete-asset':
                        return this.indexerController.deleteAsset(data);
                    default:
                        //TODO: verificar porque esse tipo never ta dando errado aqui
                        //assertNever(data);
                        return Promise.resolve();
                }
            },
        });
    }

    reindex(ctx: RequestContext) {
        return this.updateIndexQueue.add({ type: 'reindex', ctx: ctx.serialize() });
    }


    updateAsset(ctx: RequestContext, asset: Asset) {
        return this.updateIndexQueue.add({ type: 'update-asset', ctx: ctx.serialize(), asset: asset as any });
    }

    deleteAsset(ctx: RequestContext, asset: Asset) {
        return this.updateIndexQueue.add({ type: 'delete-asset', ctx: ctx.serialize(), asset: asset as any });
    }
    
    private jobWithProgress(
        job: Job<UpdateIndexQueueJobData>,
        ob: Observable<ReindexMessageResponse>,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            let total: number | undefined;
            let duration = 0;
            let completed = 0;
            ob.subscribe({
                next: (response: ReindexMessageResponse) => {
                    if (!total) {
                        total = response.total;
                    }
                    duration = response.duration;
                    completed = response.completed;
                    const progress = total === 0 ? 100 : Math.ceil((completed / total) * 100);
                    job.setProgress(progress);
                },
                complete: () => {
                    resolve({
                        success: true,
                        indexedItemCount: total,
                        timeTaken: duration,
                    });
                },
                error: (err: any) => {
                    Logger.error(err.message || JSON.stringify(err), undefined, err.stack);
                    reject(err);
                },
            });
        });
    }
}
