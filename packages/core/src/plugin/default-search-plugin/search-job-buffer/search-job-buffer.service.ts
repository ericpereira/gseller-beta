import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { forkJoin } from 'rxjs';

import { ConfigService } from '../../../config/config.service';
import { isInspectableJobQueueStrategy } from '../../../config/job-queue/inspectable-job-queue-strategy';
import { Logger } from '../../../config/logger/vendure-logger';
import { JobQueueService } from '../../../job-queue/job-queue.service';
import { SubscribableJob } from '../../../job-queue/subscribable-job';
import { BUFFER_SEARCH_INDEX_UPDATES } from '../constants';
import { SearchIndexJobBuffer } from './search-index-job-buffer';

@Injectable()
export class SearchJobBufferService implements OnApplicationBootstrap {
    readonly searchIndexJobBuffer = new SearchIndexJobBuffer();

    constructor(
        private jobQueueService: JobQueueService,
        private configService: ConfigService,
        @Inject(BUFFER_SEARCH_INDEX_UPDATES) private bufferUpdates: boolean,
    ) {}

    onApplicationBootstrap(): any {
        if (this.bufferUpdates === true) {
            this.jobQueueService.addBuffer(this.searchIndexJobBuffer);
        }
    }

    async getPendingSearchUpdates(): Promise<number> {
        if (!this.bufferUpdates) {
            return 0;
        }
        const bufferSizes = await this.jobQueueService.bufferSize(
            this.searchIndexJobBuffer,
        );
        return (
            (bufferSizes[this.searchIndexJobBuffer.id] ?? 0)
        );
    }

    async runPendingSearchUpdates(): Promise<void> {
        if (!this.bufferUpdates) {
            return;
        }
        await this.jobQueueService.flush(this.searchIndexJobBuffer);
    }
}
