import { CustomOrderStates } from '@vendure/core';

declare module '@vendure/core' {
  interface CustomOrderStates {
    ValidatingCustomer: never;
  }
}