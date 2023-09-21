import { CustomFields, LanguageCode } from '@gseller/core';

const OrderCustomFields: CustomFields['Order'] = [
    {
        name: "pagarmeOrderId",
        type: "string",
        label: [
            { languageCode: LanguageCode.pt_BR, value: 'ID da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Order ID on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'ID ordine su Pagar.me' }
        ],
        description: [
            { languageCode: LanguageCode.pt_BR, value: 'ID da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Order ID on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'ID ordine su Pagar.me' }
        ]
    },
    {
        name: "pagarmeMetadata",
        type: "text",
        label: [
            { languageCode: LanguageCode.pt_BR, value: 'Metadata do último pagamento na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Metadata from last payment on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Metadata su Pagar.me' }
        ],
        description: [
            { languageCode: LanguageCode.pt_BR, value: 'Metadata do último pagamento na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Metadata from last payment on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Metadata su Pagar.me' }
        ]
    },
    {
        name: "pagarmeQrcode",
        type: "string",
        label: [
            { languageCode: LanguageCode.pt_BR, value: 'Qrcode da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Qrcode on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Qrcode su Pagar.me' }
        ],
        description: [
            { languageCode: LanguageCode.pt_BR, value: 'Qrcode da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Qrcode on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Qrcode su Pagar.me' }
        ]
    },
    {
        name: "pagarmeBoletoUrl",
        type: "string",
        label: [
            { languageCode: LanguageCode.pt_BR, value: 'Boleto da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Boleto on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Boleto su Pagar.me' }
        ],
        description: [
            { languageCode: LanguageCode.pt_BR, value: 'Boleto da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Boleto on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Boleto su Pagar.me' }
        ]
    },
    {
        name: "pagarmePaymentType",
        type: "string",
        label: [
            { languageCode: LanguageCode.pt_BR, value: 'Tipo de pagamento da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Payment type on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Tipo de pagamento su Pagar.me' }
        ],
        description: [
            { languageCode: LanguageCode.pt_BR, value: 'Tipo de pagamento da ordem na Pagar.me' },
            { languageCode: LanguageCode.en, value: 'Payment type on Pagar.me' },
            { languageCode: LanguageCode.it, value: 'Tipo di pagamento dell\'ordine su Pagar.me' }
        ]
    }
];

export { OrderCustomFields };