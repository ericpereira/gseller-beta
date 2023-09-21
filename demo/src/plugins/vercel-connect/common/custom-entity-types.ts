import { VercelDeploy } from '../entities/vercel-deploy.entity';

declare module '@gseller/core' {
    export class VercelDeployEntity extends VercelDeploy { }
}