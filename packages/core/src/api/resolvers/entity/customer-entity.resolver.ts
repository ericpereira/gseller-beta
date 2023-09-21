import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { HistoryEntryListOptions, QueryOrdersArgs, SortOrder } from '@gseller/common/lib/generated-types';
import { PaginatedList } from '@gseller/common/lib/shared-types';

import { Address } from '../../../entity/address/address.entity';
import { Customer } from '../../../entity/customer/customer.entity';
import { CustomerService } from '../../../service/services/customer.service';
import { UserService } from '../../../service/services/user.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Customer')
export class CustomerEntityResolver {
    constructor(
        private customerService: CustomerService,
        private userService: UserService,
    ) {}
    @ResolveField()
    async addresses(
        @Ctx() ctx: RequestContext,
        @Parent() customer: Customer,
        @Api() apiType: ApiType,
    ): Promise<Address[]> {
        if (apiType === 'shop' && !ctx.activeUserId) {
            // Guest customers should not be able to see this data
            return [];
        }
        return this.customerService.findAddressesByCustomerId(ctx, customer.id);
    }

    @ResolveField()
    user(@Ctx() ctx: RequestContext, @Parent() customer: Customer) {
        if (customer.user) {
            return customer.user;
        }

        return this.userService.getUserByEmailAddress(ctx, customer.emailAddress, 'customer');
    }
}

@Resolver('Customer')
export class CustomerAdminEntityResolver {
    constructor(private customerService: CustomerService) {}

    @ResolveField()
    groups(@Ctx() ctx: RequestContext, @Parent() customer: Customer) {
        if (customer.groups) {
            return customer.groups;
        }
        return this.customerService.getCustomerGroups(ctx, customer.id);
    }
}
