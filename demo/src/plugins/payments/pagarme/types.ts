//tipagem necessária para o vendure reconhecer o novo state quando for utilizado por outras funções por exemplo
import { CustomOrderStates } from '@gseller/core';

declare module '@gseller/core' {
  interface CustomOrderStates {
    PaymentFailed: never;
    PaymentRefunded: never;
  }
}