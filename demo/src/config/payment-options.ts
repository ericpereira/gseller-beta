import { VendureConfig, dummyPaymentHandler } from '@vendure/core';

export const paymentOptions: VendureConfig['paymentOptions'] = {
    paymentMethodHandlers: [dummyPaymentHandler],
}