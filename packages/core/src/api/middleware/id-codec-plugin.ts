import { isObject } from '@ericpereiraglobalsys/common/lib/shared-utils';
import { ApolloServerPlugin, GraphQLRequestListener, GraphQLServiceContext } from 'apollo-server-plugin-base';
import { DocumentNode, OperationDefinitionNode } from 'graphql';

import { GraphqlValueTransformer } from '../common/graphql-value-transformer';
import { IdCodecService } from '../common/id-codec.service';

/**
 * Encodes the ids of outgoing responses according to the configured EntityIdStrategy.
 *
 * This is done here and not via a Nest Interceptor because it's not possible
 * according to https://github.com/nestjs/graphql/issues/320
 */
export class IdCodecPlugin implements ApolloServerPlugin {
    private graphqlValueTransformer: GraphqlValueTransformer;
    constructor(private idCodecService: IdCodecService) {}

    async serverWillStart(service: GraphQLServiceContext): Promise<void> {
        this.graphqlValueTransformer = new GraphqlValueTransformer(service.schema);
    }

    async requestDidStart(): Promise<GraphQLRequestListener> {
        return {
            willSendResponse: async requestContext => {
                const { document } = requestContext;
                if (document) {
                    const data = requestContext.response.data;
                    if (data) {
                        this.encodeIdFields(document, data);
                    }
                }
            },
        };
    }

    private encodeIdFields(document: DocumentNode, data: Record<string, any>) {
        const typeTree = this.graphqlValueTransformer.getOutputTypeTree(document);
        this.graphqlValueTransformer.transformValues(typeTree, data, (value, type) => {
            const isIdType = type && type.name === 'ID';
            if (type && type.name === 'JSON' && isObject(value)) {
                return this.idCodecService.encode(value, [
                    'paymentId',
                    'fulfillmentId',
                    'orderItemIds',
                    'orderLineId',
                    'promotionId',
                    'refundId',
                    'groupId',
                    'modificationId',
                ]);
            }
            return isIdType ? this.idCodecService.encode(value) : value;
        });
    }
}
