import { CustomOrderStates } from '@ericpereiraglobalsys/core';

declare module '@ericpereiraglobalsys/core' {
  interface CustomOrderStates {
    ValidatingCustomer: never;
  }
}