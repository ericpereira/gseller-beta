import { OnApplicationBootstrap } from "@nestjs/common";
import {
  PluginCommonModule,
  VendurePlugin,
  ShippingMethodService,
  EventBus,
  LanguageCode,
} from "@ericpereiraglobalsys/core";

import { customFulfillmentHandler } from "./correios-shipping.fulfillment-handler";
import { flatRateCalculator } from "./correios-shipping.calculator";
import { correiosEligibilityChecker } from "./correios-shipping.egibility-check";
import { RegisterDistribuitionCenterEvent } from "../../../../event-bus/events/register-distribuition-center-event";

@VendurePlugin({
  imports: [PluginCommonModule],
  compatibility: "2.0.5",
  configuration: (config) => {
    config.shippingOptions.shippingEligibilityCheckers.push(
      correiosEligibilityChecker
    );
    config.shippingOptions.shippingCalculators.push(flatRateCalculator);
    config.shippingOptions.fulfillmentHandlers.push(customFulfillmentHandler);

    return config;
  },
})
export class CorreiosShippingPlugin implements OnApplicationBootstrap {
  constructor(
    private eventBus: EventBus,
    private shippingMethodService: ShippingMethodService
  ) {}

  onApplicationBootstrap() {
    this.eventBus
      .ofType(RegisterDistribuitionCenterEvent)
      .subscribe(async (event) => {
        await this.shippingMethodService.create(event.ctx, {
          code: "correios",
          fulfillmentHandler: customFulfillmentHandler.code,
          checker: {
            code: correiosEligibilityChecker.code,
            arguments: correiosEligibilityChecker.args,
          },
          calculator: {
            code: flatRateCalculator.code,
            arguments: flatRateCalculator.args,
          },
          translations: [
            {
              languageCode: LanguageCode.pt_BR,
              name: "correios",
              description: "Método de entregas via Correios",
            },
            {
              languageCode: LanguageCode.en,
              name: "correios",
              description: "Correios Shipping Method",
            },
          ],
        });
      });
  }
}
