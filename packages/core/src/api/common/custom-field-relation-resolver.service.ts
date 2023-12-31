import { Injectable } from '@nestjs/common';
import { ID } from '@ericpereiraglobalsys/common/lib/shared-types';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { Translatable } from '../../common/types/locale-types';
import { ConfigService } from '../../config/config.service';
import { RelationCustomFieldConfig } from '../../config/custom-field/custom-field-types';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { VendureEntity } from '../../entity/base/base.entity';
import { TranslatorService } from '../../service/helpers/translator/translator.service';

import { RequestContext } from './request-context';

export interface ResolveRelationConfig {
    ctx: RequestContext;
    entityId: ID;
    entityName: string;
    fieldDef: RelationCustomFieldConfig;
}

@Injectable()
export class CustomFieldRelationResolverService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private translator: TranslatorService,
    ) {}

    /**
     * @description
     * Used to dynamically resolve related entities in custom fields. Based on the field
     * config, this method is able to query the correct entity or entities from the database
     * to be returned through the GraphQL API.
     */
    async resolveRelation(config: ResolveRelationConfig): Promise<VendureEntity | VendureEntity[]> {
        const { ctx, entityId, entityName, fieldDef } = config;

        const subQb = this.connection
            .getRepository(ctx, entityName)
            .createQueryBuilder('entity')
            .leftJoin(`entity.customFields.${fieldDef.name}`, 'relationEntity')
            .select('relationEntity.id')
            .where('entity.id = :id');

        const qb = this.connection
            .getRepository(ctx, fieldDef.entity)
            .createQueryBuilder('relation')
            .where(`relation.id IN (${subQb.getQuery()})`)
            .setParameters({ id: entityId });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        const result = fieldDef.list ? await qb.getMany() : await qb.getOne();

        const translated: any = Array.isArray(result)
            ? result.map(r => (this.isTranslatable(r) ? this.translator.translate(r, ctx) : r))
            : this.isTranslatable(result)
            ? this.translator.translate(result, ctx)
            : result;

        return translated;
    }

    private isTranslatable(input: unknown): input is Translatable {
        return typeof input === 'object' && input != null && input.hasOwnProperty('translations');
    }
}
