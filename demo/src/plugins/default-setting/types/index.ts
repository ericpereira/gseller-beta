import { InitialData } from '@vendure/core/dist/data-import/index';

export interface InitialDataDefinition extends InitialData {
  facets: Array<{ name: string; values: string[] }>;
}
