import { OrderProcess } from "@gseller/core";

export const customOrderProcess: OrderProcess<'PaymentFailed' | 'PaymentRefunded'> = {
    transitions: {
        PaymentAuthorized: {
            to: ['PaymentFailed'],
            mergeStrategy: 'merge',
        },
        PaymentSettled: {
            to: ['PaymentRefunded'],
            mergeStrategy: 'merge',
        },
        PartiallyShipped: {
            to: ['PaymentRefunded'],
            mergeStrategy: 'merge',
        },
        Shipped: {
            to: ['PaymentRefunded'],
            mergeStrategy: 'merge',
        },
        PartiallyDelivered: {
            to: ['PaymentRefunded'],
            mergeStrategy: 'merge',
        },
        Delivered: {
            to: ['PaymentRefunded'],
            mergeStrategy: 'merge',
        },
        Modifying: {
            to: ['PaymentRefunded'],
            mergeStrategy: 'merge',
        },
        ArrangingAdditionalPayment: {
            to: ['PaymentRefunded'],
            mergeStrategy: 'merge',
        },
        PaymentFailed: {
            to: ['ArrangingPayment', 'Cancelled'],
            mergeStrategy: 'replace',
        },
        PaymentRefunded: {
            to: ['Cancelled'],
            mergeStrategy: 'replace',
        }
    }
};