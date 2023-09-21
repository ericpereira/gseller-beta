import { LanguageCode, ShippingEligibilityChecker } from "@gseller/core";

export const correiosEligibilityChecker = new ShippingEligibilityChecker({
  code: "jamef-eligibility-checker",
  description: [
    {
      languageCode: LanguageCode.en,
      value:
        "Checks if the order total is above the minimum amount that Jamef asks for",
    },
  ],
  args: {},
  check: async () => {
    return true;
  },
});
