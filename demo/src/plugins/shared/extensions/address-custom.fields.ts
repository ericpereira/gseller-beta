import { CustomFieldConfig, LanguageCode } from "@vendure/core";

export default [
    {
        type: "string",
        name: "number",
        label: [{ languageCode: LanguageCode.pt_BR, value: "Número" }],
    },
    {
        type: "string",
        name: "neighborhood",
        label: [{ languageCode: LanguageCode.pt_BR, value: "Bairro" }],
    },
] as CustomFieldConfig[];

