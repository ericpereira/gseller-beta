import { CustomerHistoryEntryData } from '@gseller/core';

export const CUSTOM_TYPE = 'CUSTOM_TYPE';

declare module '@gseller/core' {
    interface OrderHistoryEntryData {
        [CUSTOM_TYPE]: { message: string };
    }

    interface CustomerHistoryEntryData {
        [CUSTOM_TYPE]: { name: string };
    }
}
