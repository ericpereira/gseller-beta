import { MULTIVENDOR_PLUGIN_OPTIONS } from './constants';
import {
  LanguageCode,
  PluginCommonModule,
  VendurePlugin,
  configureDefaultOrderProcess,
} from '@vendure/core';

import { ContextStrategy } from './context-auth-strategy';
import { MultivendorPluginOptions } from './types';
import { MultivendorShippingLineAssignmentStrategy } from './config/shipping-line-assignment-strategy';
import { multivendorOrderProcess } from './config/order-process';
import { multivendorPaymentMethodHandler } from './config/payment-handler';
import { multivendorShippingEligibilityChecker } from './config/shipping-eligibility-checker';

@VendurePlugin({
  compatibility: "2.0.5",
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Seller.push({
      name: 'connectedAccountId',
      label: [{ languageCode: LanguageCode.en, value: 'Connected account ID' }],
      description: [{ languageCode: LanguageCode.en, value: 'The ID used to process connected payments' }],
      type: 'string',
      public: false,
    });

    const customDefaultOrderProcess = configureDefaultOrderProcess({
      checkFulfillmentStates: false,
    });
    config.orderOptions.process = [customDefaultOrderProcess, multivendorOrderProcess];
    return config;
  },
  providers: [{ provide: MULTIVENDOR_PLUGIN_OPTIONS, useFactory: () => MultivendorPlugin.options }, ContextStrategy],
})
export class MultivendorPlugin {
  static options: MultivendorPluginOptions;

  constructor() { }

  static init(options: MultivendorPluginOptions) {
    MultivendorPlugin.options = options;
    return MultivendorPlugin;
  }
}
