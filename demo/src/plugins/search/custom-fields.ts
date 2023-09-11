import { CustomFields, LanguageCode } from '@vendure/core';

const CollectionCustomFields: CustomFields['Collection'] = [
  {
    name: 'type',
    type: 'string',
    label: [
      { languageCode: LanguageCode.pt_BR, value: 'Tipo de coleção' },
      { languageCode: LanguageCode.en, value: 'Collection type' },
    ],
    description: [
      { languageCode: LanguageCode.en, value: 'Filter that helps classify the type of collection' },
      { languageCode: LanguageCode.pt_BR, value: 'Filtro que auxilia na classificação do tipo de coleção' },
    ],
  },
];

export { CollectionCustomFields };
