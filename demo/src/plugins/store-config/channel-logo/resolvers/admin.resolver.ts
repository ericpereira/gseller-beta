import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
    Allow, Asset, AssetService, ChannelService, Ctx, isGraphQlErrorResult,
    Permission, RequestContext, Transaction
} from '@vendure/core';

@Resolver()
export class ChannelLogoResolver {

    constructor(
        private assetService: AssetService,
        private channelService: ChannelService
    ) { }

    @Transaction()
    @Mutation()
    @Allow(Permission.Authenticated)
    async setChannelLogo(
        @Ctx() ctx: RequestContext,
        @Args() args: { file: any },
    ): Promise<Asset | undefined> {

        const { channel } = ctx

        if (!channel) {
            return;
        }

        const asset = await this.assetService.create(ctx, {
            file: args.file,
            tags: ['logo'],
        });


        if (isGraphQlErrorResult(asset)) {
            throw asset;
        }

        await this.channelService.update(ctx, {
            id: channel.id,
            customFields: {
                logoId: asset.id,
            },
        });

        return asset;
    }


}