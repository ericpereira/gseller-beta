import { ID, RequestContext, TransactionalConnection } from "@gseller/core";
import { InvalidData, LayoutCategoryInvalidID, LayoutCategoryTitleInvalid } from "../graphql.errors";

import { Injectable } from '@nestjs/common';
import { Layout } from "../entities/layout.entity";
import { LayoutCategory } from "../entities/layout-category.entity";

@Injectable()
export class LayoutCategoryService {
    constructor(
        private connection: TransactionalConnection
    ) { }

    async create(ctx: RequestContext, input: { title: string }) {
        try {
            const { title } = input
            if (!title) throw new LayoutCategoryTitleInvalid()

            return this.connection.rawConnection.getRepository(LayoutCategory).save({ title })

        } catch (error) {
            return error
        }
    }

    async findAll(ctx: RequestContext) {
        try {
            return this.connection.rawConnection.getRepository(LayoutCategory).find({ order: { title: 'ASC' } })
        } catch (error) {
            return error
        }
    }

    async find(ctx: RequestContext, id: ID) {
        try {
            if (!id) throw new LayoutCategoryInvalidID()
            return this.connection.rawConnection.getRepository(LayoutCategory).findOne({ where: { id } })
        } catch (error) {
            return error
        }
    }

    async update(ctx: RequestContext, id: ID, data: Partial<Layout>) {
        try {
            if (!id) throw new LayoutCategoryInvalidID()
            if (!data) throw new InvalidData()
            const updated = await this.connection.rawConnection.getRepository(LayoutCategory).update(id, { ...data })
            return { success: !!updated }
        } catch (error) {
            return false
        }
    }

    async delete(ctx: RequestContext, id: ID) {
        try {
            if (!id) throw new LayoutCategoryInvalidID()
            const deleted = await this.connection.rawConnection.getRepository(LayoutCategory).delete(id)
            return { success: !!deleted }
        } catch (error) {
            return false
        }
    }
}