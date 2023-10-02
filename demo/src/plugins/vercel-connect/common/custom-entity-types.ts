import { VercelDeploy } from '../entities/vercel-deploy.entity';

declare module '@ericpereiraglobalsys/core' {
    export class VercelDeployEntity extends VercelDeploy { }
}