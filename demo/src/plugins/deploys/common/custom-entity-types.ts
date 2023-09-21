import { Deploy } from '../entities/deploy.entity';

declare module '@gseller/core' {
    export class DeploysEntity extends Deploy { }
}