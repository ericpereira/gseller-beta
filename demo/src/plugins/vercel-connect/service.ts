import { Administrator, RequestContext } from '@gseller/core';

import { Injectable } from "@nestjs/common";
import { VercelDeploymentWorker } from './workers/building-vercel';

@Injectable()
export class VercelConnectService {

    constructor(
        private vercelDeploymentWorker: VercelDeploymentWorker
    ) { }

    async deploy(
        ctx: RequestContext,
        shopName: string,
        channelToken: string,
        path: string
    ) {
        this.vercelDeploymentWorker.main(
            shopName,
            channelToken,
            path
        );
    }

}
