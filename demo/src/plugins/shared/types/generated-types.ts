import { Administrator } from '@ericpereiraglobalsys/core';

export * from '@ericpereiraglobalsys/common/lib/generated-types';
declare module '@ericpereiraglobalsys/common/lib/generated-types' {
  interface Producer {
    firstName: string;
    lastName: string;
    description: string;
    emailAddress: string;
    phoneNumber: string;
  }

  interface NewShop {
    channelName: string;
    channelToken: string;
    demoSiteUrl: string;
    emailAddress: string;
  }

  interface ContactUs {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    country: string;
    region: string;
    message: string;
  }

  interface BaseResult {
    __typename?: string;
    message: string;
    success: boolean;
  }

  interface InviteFriend {
    emailAddress: string;
    guest: string;
    url: string;
  }

  interface BaseResult {
    __typename?: string;
    message: string;
    success: boolean;
  }
}
