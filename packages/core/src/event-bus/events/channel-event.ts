import { CreateChannelInput, UpdateChannelInput } from '@ericpereiraglobalsys/common/lib/generated-types';
import { ID } from '@ericpereiraglobalsys/common/lib/shared-types';

import { RequestContext } from '../../api';
import { Channel } from '../../entity';
import { VendureEntityEvent } from '../vendure-entity-event';

type ChannelInputTypes = CreateChannelInput | UpdateChannelInput | ID;

/**
 * @description
 * This event is fired whenever a {@link Channel} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class ChannelEvent extends VendureEntityEvent<Channel, ChannelInputTypes> {
    constructor(
        ctx: RequestContext,
        entity: Channel,
        type: 'created' | 'updated' | 'deleted',
        input?: ChannelInputTypes,
    ) {
        super(entity, type, ctx, input);
    }
}
