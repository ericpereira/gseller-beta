import { InitialDataDefinition } from '../types';
import { LanguageCode } from '@ericpereiraglobalsys/core';

export const initialData: InitialDataDefinition = {
  defaultLanguage: LanguageCode.pt_BR,
  defaultZone: 'Americas',
  taxRates: [
    { name: 'Standard Tax', percentage: 0 },
    { name: 'Reduced Tax', percentage: 0 },
    { name: 'Zero Tax', percentage: 0 },
  ],
  shippingMethods: [
    { name: 'Standard Shipping', price: 500 },
    { name: 'Express Shipping', price: 1000 },
  ],
  paymentMethods: [
    {
      name: 'Standard Payment',
      handler: {
        code: 'dummy-payment-handler',
        arguments: [{ name: 'automaticSettle', value: 'false' }],
      },
    },
  ],
  countries: [
    { name: 'Brazil', code: LanguageCode.pt_BR, zone: 'Americas' },
  ],
  facets: [],
  collections: [],
};
