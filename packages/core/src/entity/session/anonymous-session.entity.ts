import { DeepPartial } from '@gseller/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { Session } from './session.entity';

/**
 * @description
 * An anonymous session is created when a unauthenticated user interacts with restricted operations,
 * such as calling the `activeOrder` query in the Shop API. Anonymous sessions allow a guest Customer
 * to maintain an order without requiring authentication and a registered account beforehand.
 *
 * @docsCategory entities
 */
@ChildEntity()
export class AnonymousSession extends Session {
    constructor(input: DeepPartial<AnonymousSession>) {
        super(input);
    }
}
