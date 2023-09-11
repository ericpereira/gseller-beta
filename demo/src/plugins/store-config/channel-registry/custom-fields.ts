import { Asset, CustomFields, LanguageCode } from '@vendure/core';

export const customFields: CustomFields['Administrator'] = [
  {
    type: 'string',
    name: 'connectedAccountId',
    label: [
      { languageCode: LanguageCode.en_US, value: 'Connected Account ID' },
      { languageCode: LanguageCode.pt_BR, value: 'ID da Conta Conectada' },
    ],
  },
];
