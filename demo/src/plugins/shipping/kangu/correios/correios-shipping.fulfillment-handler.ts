import { FulfillmentHandler, LanguageCode } from "@gseller/core";

export const customFulfillmentHandler = new FulfillmentHandler({
  code: "correios-fulfillment",
  description: [
    {
      languageCode: LanguageCode.pt_BR,
      value: "Correios Fulfillment",
    },
  ],
  args: {
    method: {
      type: "string",
      defaultValue: "Correios",
      label: [
        {
          languageCode: LanguageCode.pt_BR,
          value: "Método de envio",
        },
      ],
    },
    trackingCode: {
      type: "string",
      defaultValue: "",
      label: [
        {
          languageCode: LanguageCode.pt_BR,
          value: "Código de rastreio",
        },
      ],
    },
  },
  createFulfillment: async () => {
    return {
      method: "correios-fulfillment",
      trackingCode: "",
      nextStates: ["Delivered"],
    };
  },
});
