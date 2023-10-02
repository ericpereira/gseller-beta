import { CustomerHistoryEntryData } from '@ericpereiraglobalsys/core';

export const CUSTOM_TYPE = 'CUSTOM_TYPE';

declare module '@ericpereiraglobalsys/core' {
    interface OrderHistoryEntryData {
        [CUSTOM_TYPE]: { message: string };
    }

    interface CustomerHistoryEntryData {
        [CUSTOM_TYPE]: { name: string };
    }
}
