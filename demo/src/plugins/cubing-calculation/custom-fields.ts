import { CustomFields, LanguageCode } from "@ericpereiraglobalsys/core";

export const ProductVariantsCustomFields: CustomFields["ProductVariant"] = [
  {
    name: "height",
    type: "string",
    label: [
      { languageCode: LanguageCode.pt_BR, value: "Altura" },
      { languageCode: LanguageCode.en, value: "Height" },
    ],
    description: [
      {
        languageCode: LanguageCode.pt_BR,
        value: "Altura do produto",
      },
      { languageCode: LanguageCode.en, value: "height of product" },
    ],
  },
  {
    name: "width",
    type: "string",
    label: [
      { languageCode: LanguageCode.pt_BR, value: "Largura" },
      { languageCode: LanguageCode.en, value: "width" },
    ],
    description: [
      {
        languageCode: LanguageCode.pt_BR,
        value: "Largura do produto",
      },
      { languageCode: LanguageCode.en, value: "width of product" },
    ],
  },
  {
    name: "length",
    type: "string",
    label: [
      { languageCode: LanguageCode.pt_BR, value: "Comprimento" },
      { languageCode: LanguageCode.en, value: "length" },
    ],
    description: [
      {
        languageCode: LanguageCode.pt_BR,
        value: "Comprimento do produto",
      },
      { languageCode: LanguageCode.en, value: "lentgh of product" },
    ],
  },
  {
    name: "weight",
    type: "string",
    label: [
      { languageCode: LanguageCode.pt_BR, value: "Peso" },
      { languageCode: LanguageCode.en, value: "Weight" },
    ],
    description: [
      {
        languageCode: LanguageCode.pt_BR,
        value: "Peso do produto",
      },
      { languageCode: LanguageCode.en, value: "weight of product" },
    ],
  },
];
