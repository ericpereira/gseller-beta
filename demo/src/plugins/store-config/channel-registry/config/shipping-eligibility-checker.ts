import { EntityHydrator, LanguageCode, ShippingEligibilityChecker, idsAreEqual } from '@gseller/core';

import { DEFAULT_CHANNEL_CODE } from '@gseller/common/lib/shared-constants';

let entityHydrator: EntityHydrator;

export const multivendorShippingEligibilityChecker = new ShippingEligibilityChecker({
  code: 'multivendor-shipping-eligibility-checker',
  description: [{ languageCode: LanguageCode.en, value: 'Multivendor Shipping Eligibility Checker' }],
  args: {},
  init(injector) {
    entityHydrator = injector.get(EntityHydrator);
  },
  check: async (ctx, order, args, method) => {
    await entityHydrator.hydrate(ctx, method, { relations: ['channels'] });
    const sellerChannel = method.channels.find((c) => c.code !== DEFAULT_CHANNEL_CODE);
    if (!sellerChannel) {
      return false;
    }
    for (const line of order.lines) {
      if (idsAreEqual(line.sellerChannelId, sellerChannel.id)) {
        return true;
      }
    }
    return false;
  },
});
