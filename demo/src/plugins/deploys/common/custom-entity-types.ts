import { Deploy } from '../entities/deploy.entity';

declare module '@ericpereiraglobalsys/core' {
    export class DeploysEntity extends Deploy { }
}