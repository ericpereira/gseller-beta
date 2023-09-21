import { CustomOrderStates } from '@gseller/core';

declare module '@gseller/core' {
  interface CustomOrderStates {
    ValidatingCustomer: never;
  }
}