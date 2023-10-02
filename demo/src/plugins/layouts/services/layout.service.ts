import { AssetService, EventBus, ID, RequestContext, TransactionalConnection } from "@ericpereiraglobalsys/core";
import { InvalidLayoutPrice, LayoutInvalid, LayoutTitleInvalid } from "../graphql.errors";

import { In } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InputCreateLayout } from "../types";
import { Layout } from "../entities/layout.entity";
import { LayoutCategory } from "../entities/layout-category.entity";
import path from 'path';

@Injectable()
export class LayoutService {
    constructor(
        private connection: TransactionalConnection,
        private assetService: AssetService,
        private eventBus: EventBus,
    ) { }

    async getData(ctx: RequestContext, webAssetId: ID, mobileAssetId: ID, categories: [ID]) {
        const webAsset = webAssetId ? await this.assetService.findOne(ctx, webAssetId) : null
        const mobileAsset = mobileAssetId ? await this.assetService.findOne(ctx, mobileAssetId) : null

        const myCategories = categories && categories.length > 0 ? await this.connection.rawConnection.getRepository(LayoutCategory).find({
            where: {
                id: In(categories)
            }
        }) : []

        return { webAsset, mobileAsset, myCategories }
    }

    async create(ctx: RequestContext, input: InputCreateLayout) {
        try {
            const { title, price, categories, webAssetId, mobileAssetId } = input
            if (!title) throw new LayoutTitleInvalid()
            if (price && price < 0) throw Error('Invalid layout price')

            const { webAsset, mobileAsset, myCategories } = await this.getData(ctx, webAssetId as ID, mobileAssetId as ID, categories as [ID])

            // verify if path exists in local
            const layoutsPath = path.join(__dirname, '../../../../layouts', input.path!)

            if (!layoutsPath) throw Error('Layout path not found')

            return this.connection.rawConnection.getRepository(Layout).save({
                ...input,
                categories: myCategories,
                webAssetId: webAsset?.id,
                mobileAssetId: mobileAsset?.id
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findAll(ctx: RequestContext, isActive?: boolean) {
        try {
            return this.connection.rawConnection.getRepository(Layout).find({
                where: isActive ? {
                    isActive
                } : {},
                order: { title: 'ASC' }
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async find(ctx: RequestContext, id: ID) {
        try {
            return this.connection.rawConnection.getRepository(Layout).findOne({ where: { id } })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async update(ctx: RequestContext, id: ID, data: InputCreateLayout) {
        try {
            const { categories, webAssetId, mobileAssetId } = data

            const { webAsset, mobileAsset, myCategories } = await this.getData(ctx, webAssetId as ID, mobileAssetId as ID, categories as [ID])

            const layout = await this.connection.rawConnection.getRepository(Layout).findOne({ where: { id } })

            if (!layout) throw new LayoutInvalid()

            const updated = await this.connection.rawConnection.getRepository(Layout).save({
                ...layout,
                ...data,
                categories: myCategories,
                webAssetId: webAsset?.id,
                mobileAssetId: mobileAsset?.id
            })
            return { success: !!updated }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }

    async delete(ctx: RequestContext, id: ID) {
        try {
            if (!id) throw Error('Layout id invalid')
            const deleted = await this.connection.rawConnection.getRepository(Layout).delete(id)
            return { success: !!deleted }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
    }
}