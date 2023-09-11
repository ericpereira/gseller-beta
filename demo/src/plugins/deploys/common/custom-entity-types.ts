import { Deploy } from '../entities/deploy.entity';

declare module '@vendure/core' {
    export class DeploysEntity extends Deploy { }
}