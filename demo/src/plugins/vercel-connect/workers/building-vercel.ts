import {
  Deployment,
  DeploymentOptions,
  VercelClientOptions,
  createDeployment
} from "@vercel/client";
import {
  EventBus,
  JobQueue,
  JobQueueService,
  Logger,
  RequestContextService,
  TransactionalConnection
} from "@ericpereiraglobalsys/core";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { TemplateNotFoundError, VercelDeploymentFailedError } from "../common/graphql.error";
import { VercelDeploymentJob, VercelDeploymentJobData } from "./types";

import { BuildPlatformEvent } from "../../../event-bus/events/build-platform.event";
import { DeployType } from "../../../plugins/deploys/entities/deploy.entity";
import { VercelDeploy } from "../entities/vercel-deploy.entity";
import { normalizeString } from '@ericpereiraglobalsys/common/lib/normalize-string';
import path from 'path';

@Injectable()
export class VercelDeploymentWorker implements OnModuleInit {

  private jobQueue: JobQueue<VercelDeploymentJobData>;

  private clientOptions: VercelClientOptions = {
    token: process.env.VERCEL_TOKEN || '',
    path: '',
    teamId: process.env.VERCEL_TEAM_ID || '',
    apiUrl: process.env.VERCEL_API_URL || 'https://api.vercel.com/v1'
  };

  private deploymentOptions: DeploymentOptions = {
    name: 'shop-demo',
    regions: ['gru1'],
    routes: [{ src: '/(.*)', dest: '/index.js' }],
    public: true,
    projectSettings: {
      framework: 'nextjs',
      devCommand: 'next dev',
      buildCommand: 'next build',
      outputDirectory: '.next'
    },
    build: {
      env: {
        NEXT_PUBLIC_CHANNEL: '',
        NEXT_PUBLIC_URL: ''
      }
    }
  };

  constructor(
    private jobQueueService: JobQueueService,
    private eventBus: EventBus,
    private connection: TransactionalConnection,
    private requestContext: RequestContextService
  ) { }

  async onModuleInit() {
    this.jobQueue = await this.jobQueueService.createQueue<VercelDeploymentJobData>({
      name: "building-vercel",
      process: this.handleJob.bind(this),
    });
  }

  async main(
    shopName: string,
    channelToken: string,
    path: string
  ) {
    try {

      Logger.info(`Vercel`, `Building Vercel`);

      this.jobQueue.add({
        shopName,
        channelToken,
        path
      }, { retries: 3 });

      return { success: true };
    } catch (error: any) {
      Logger.error(`Vercel`, `Error building Vercel: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  private async handleJob(job: VercelDeploymentJob): Promise<void> {
    this.deploymentOptions.name = normalizeString(job.data.shopName, '-');
    this.deploymentOptions!.build!.env!.NEXT_PUBLIC_CHANNEL = job.data.channelToken || '';
    //TO DO: Change to the actual backend URL in the environment file
    this.deploymentOptions!.build!.env!.NEXT_PUBLIC_URL = `https://api.gseller.com.br:80`;


    if (!job.data.path) {
      throw new TemplateNotFoundError();
    }

    this.clientOptions.path = this.getDynamicPath(job.data.path);
    const deployment = await this.createDeployment(job);

    if (deployment instanceof VercelDeploymentFailedError) {
      throw deployment;
    }

    await this.saveDeploymentInformation(deployment, job);
  }

  private async createDeployment(job: VercelDeploymentJob): Promise<Deployment | VercelDeploymentFailedError> {
    let deployment: Deployment | undefined;

    for await (const event of createDeployment(this.clientOptions, this.deploymentOptions)) {

      Logger.info(`Deployment ${event.type}!`, `Building Vercel`);

      if (event.type === 'ready') {
        deployment = event.payload;
        break;
      }
    }

    if (!deployment) {
      return new VercelDeploymentFailedError();
    }

    return deployment;
  }

  private async saveDeploymentInformation(deployment: Deployment, job: VercelDeploymentJob): Promise<void> {
    try {
      const result = await this.connection
        .rawConnection
        .getRepository(VercelDeploy)
        .save({
          deployId: deployment.id,
          aliasAssigned: deployment.aliasAssigned,
          payloadAlias: deployment.aliasAssigned ? deployment.alias : null,
          ...(deployment.aliasError && { aliasError: deployment.aliasError }),
          creatorUid: deployment.creator?.uid,
          creatorUsername: deployment.creator?.username,
          creatorEmail: deployment.creator?.email,
          vercelId: deployment.id,
          name: deployment.name,
          meta: deployment.meta,
          public: deployment.public,
          readyState: deployment.readyState,
          regions: deployment.regions,
          teamId: this.clientOptions.teamId,
          url: deployment.url,
          createdIn: deployment.createdIn,
          buildingAt: deployment.buildingAt,
          env: deployment.env,
          build: deployment.build,
          target: deployment.target,
          plan: deployment.plan,
          ownerId: deployment.ownerId,
          builds: deployment.builds,
          inspectorUrl: deployment.inspectorUrl,
        });


      const ctx = await this.requestContext.create({
        apiType: 'admin',
        channelOrToken: job.data.channelToken,
      });

      //call new event to save a generic plataform
      this.eventBus.publish(
        new BuildPlatformEvent(
          ctx,
          {
            platform: DeployType.Vercel,
            metadata: JSON.stringify(result),
            url: result.url
          }
        )
      );

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private getDynamicPath(layoutName: string) {
    //get the path of the template
    return path.join(__dirname, '../../../layouts', layoutName)
  }
}
