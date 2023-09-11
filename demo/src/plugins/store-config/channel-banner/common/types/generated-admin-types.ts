import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator";
declare module "@vendure/common/lib/generated-types" {
  class CreateChannelBannerInput {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    link: string;

    @IsDate()
    @IsNotEmpty()
    startAt: string;

    @IsDate()
    @IsNotEmpty()
    endAt: string;

    @IsBoolean()
    @IsNotEmpty()
    active: boolean;
  }

  class CreateChannelBannerWithAssetInput extends CreateChannelBannerInput {
    @IsString()
    @IsNotEmpty()
    asset: any;
  }

  class CreateChannelBannerWithAssetIdInput extends CreateChannelBannerInput {
    @IsString()
    @IsNotEmpty()
    assetId: string;
  }

  class UpdateChannelBanner extends CreateChannelBannerWithAssetInput {
    @IsString()
    @IsNotEmpty()
    bannerId: string;
  }
}
