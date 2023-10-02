import { Deploy, DeployType } from "./entities/deploy.entity";
import { Logger, RequestContext, TransactionalConnection } from "@ericpereiraglobalsys/core";

import { DeployNotFoundError } from './common/graphql.error';
//TO DO: temp, import entity from core package to avoid circular dependency
import { DeployPlatformEventInput } from "../../event-bus/events/build-platform.event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeploysService {

    constructor(
        private connection: TransactionalConnection,
    ) { }

    async registerDeploy(ctx: RequestContext, input: DeployPlatformEventInput) {
        const { channel } = ctx
        if (!channel) throw Error('Channel not found')

        const { platform, metadata, url } = input
        //remove old deploys for this specific plataform
        await this.connection
            .rawConnection
            .getRepository(Deploy)
            .createQueryBuilder("deploy")
            .leftJoinAndSelect("deploy.channel", "channel")
            .where("deploy.type = :type", { type: platform })
            .andWhere("deploy.active = :active", { active: true })
            .andWhere("channel.id = :channelId", { channelId: channel.id })
            .update({ active: false })
            .execute();

        //register deploy for this platform
        const result = await this.connection.rawConnection.getRepository(Deploy).save({
            channel: ctx.channel,
            type: platform,
            active: true,
            metadata,
            url
        });

        if (!!result) Logger.info(`Channel ${channel.token} deployed to ${platform}`, `Register Deploy`);

        return result;
    }

    async getActiveDeploy(ctx: RequestContext, platform: DeployType) {
        const { channel } = ctx;

        if (!channel) {
            return Error('Channel not found')
        }

        const activeDeploy = await this.connection
            .rawConnection
            .getRepository(Deploy)
            .findOne({
                where: {
                    channel: {
                        id: channel.id
                    },
                    type: platform,
                    active: true
                }
            })

        if (!activeDeploy) {
            return new DeployNotFoundError();
        }

        return {
            __typename: 'Deploy',
            ...activeDeploy
        }
    }
}
