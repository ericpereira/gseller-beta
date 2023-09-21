import { EventBus, ID, RequestContext, TransactionalConnection } from "@gseller/core";
import { In, Not } from 'typeorm';
import { LayoutIDInvalid, LayoutInvalid } from "../graphql.errors";

import { ChannelLayout } from "../entities/channel-layout.entity";
import { Injectable } from '@nestjs/common';
import { Layout } from "../entities/layout.entity";
import { TemplateSelectedEvent } from "../../../event-bus";

@Injectable()
export class ChannelLayoutService {
    constructor(
        private connection: TransactionalConnection,
        private eventBus: EventBus,
    ) { }

    async setLayout(ctx: RequestContext, input: { layoutId: ID }) {
        try {
            const { layoutId } = input
            if (!layoutId) throw new LayoutIDInvalid()

            const layout = await this.connection.rawConnection.getRepository(Layout).findOne({ where: { id: layoutId, isActive: true } })
            if (!layout) throw new LayoutInvalid()

            const { channel } = ctx

            const oldChannelLayout = await this.connection.rawConnection.getRepository(ChannelLayout).findOne({ where: { channelId: channel.id, layoutId: layout.id } })

            const channelLayout = await this.connection.rawConnection.getRepository(ChannelLayout).save({
                ...oldChannelLayout,
                channelId: channel.id,
                layoutId: layout.id,
                isActive: true
            })

            if (channelLayout) {
                this.eventBus.publish(
                    new TemplateSelectedEvent(
                        ctx,
                        layout.path
                    ),
                );

                //caso tenha algum outro tema ativo, desativa
                const oldChannelUpdated = await this.connection.rawConnection.getRepository(ChannelLayout).update({
                    channelId: channel.id,
                    layoutId: Not(In([layoutId]))
                }, {
                    isActive: false
                })

                return {
                    __typename: "SetLayoutResult",
                    success: true
                };
            }
            return {
                __typename: "SetLayoutResult",
                success: false,
                error: "Não foi possível salvar o layout selecionado. Tente novamente."
            };
        } catch (error: any) {
            return {
                __typename: "SetLayoutResult",
                success: false,
                error: JSON.stringify(error.message)
            };
        }
    }

    async findAll(ctx: RequestContext) {
        const { channel } = ctx
        try {
            const channelLayouts = await this.connection.rawConnection.getRepository(ChannelLayout).find({ where: { channelId: channel.id } })
            if (channelLayouts && channelLayouts.length > 0) return channelLayouts.map(c => c.layout)
        } catch (error) {
            return error
        }
    }

    async getActiveLayout(ctx: RequestContext) {
        try {
            const { channel } = ctx
            
            const channelLayout = await this.connection.rawConnection.getRepository(ChannelLayout).findOne({ where: { channelId: channel.id, isActive: true } })
            
            if(!channelLayout) throw Error('This channel has no active layout')
            return channelLayout.layout
        } catch (error) {
            return error
        }
    }
}