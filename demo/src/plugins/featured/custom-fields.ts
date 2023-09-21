import { CustomFields, LanguageCode } from '@gseller/core';

const ProductCustomFields: CustomFields['Product'] = [
    {
        name: 'featured',
        type: 'boolean',
        label: [
            { languageCode: LanguageCode.en, value: 'Produtos em destaque' },
            { languageCode: LanguageCode.en, value: 'Mark as featured' },
            { languageCode: LanguageCode.it, value: 'Metti in evidenza' }
        ],
        description: [
            { languageCode: LanguageCode.pt_BR, value: 'Marque esta caixa para mostrar este produto com mais relevância em suas facetas' },
            { languageCode: LanguageCode.en, value: 'Check this box to show this product with more relevance in its facets' },
            { languageCode: LanguageCode.it, value: 'Spunta questa casella mostrare il prodotto con maggiore evidenza nelle rispettive pagine' }
        ],
        defaultValue: false
    }
];

export { ProductCustomFields };