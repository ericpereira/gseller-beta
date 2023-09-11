import { VercelDeploy } from '../entities/vercel-deploy.entity';

declare module '@vendure/core' {
    export class VercelDeployEntity extends VercelDeploy { }
}