import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, TableInheritance } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { EntityId } from '../entity-id.decorator';

/**
 * @description
 * A Session is created when a user makes a request to restricted API operations. A Session can be an {@link AnonymousSession}
 * in the case of un-authenticated users, otherwise it is an {@link AuthenticatedSession}.
 *
 * @docsCategory entities
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Session extends VendureEntity {
    @Index({ unique: true })
    @Column()
    token: string;

    @Column() expires: Date;

    @Column() invalidated: boolean;

    @EntityId({ nullable: true })
    activeOrderId?: ID;

    @EntityId({ nullable: true })
    activeChannelId?: ID;

    @Index()
    @ManyToOne(type => Channel)
    activeChannel: Channel | null;
}
