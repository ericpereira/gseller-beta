import {
  ActiveOrderStrategy,
  CustomerService,
  idsAreEqual,
  Injector,
  Order,
  OrderService,
  RequestContext,
  TransactionalConnection,
} from '@vendure/core';
import gql from 'graphql-tag';

type InputCreateActiveOrder = {
  token?: string;
  productVariantId?: number;
  quantity?: number;
}

// This strategy assumes a "orderToken" custom field is defined on the Order
// entity, and uses that token to perform a lookup to determine the active Order.
//
// Additionally, it does _not_ define a `createActiveOrder()` method, which
// means that a custom mutation would be required to create the initial Order in
// the first place and set the "orderToken" custom field.
export default class TokenActiveOrderStrategy implements ActiveOrderStrategy<InputCreateActiveOrder> {
  readonly name = 'orderToken';

  private connection: TransactionalConnection;
  private orderService: OrderService;
  private customerService: CustomerService;

  init(injector: Injector) {
    this.connection = injector.get(TransactionalConnection);
    this.orderService = injector.get(OrderService);
    this.customerService = injector.get(CustomerService)
  }

  defineInputType = () => gql`
    input OrderTokenActiveOrderInput {
      token: String
    }
  `;

  async createActiveOrder(ctx: RequestContext, input: InputCreateActiveOrder){
     if(input?.token && input.productVariantId && input.quantity){
      const existingOrder = await this.orderService.findOneByCode(ctx, input.token)
      if(existingOrder){
        //await this.orderService.addItemToOrder(ctx, existingOrder.id, input.productVariantId, input.quantity)
        return existingOrder
      }
     }

     //caso não seja passado o token, cria uma nova order
     const order = await this.orderService.create(ctx, ctx.activeUserId)
     //await this.orderService.addItemToOrder(ctx, order.id, input.productVariantId, input.quantity)
     return order
  }


  async determineActiveOrder(ctx: RequestContext, input: { token: string }) {
    if(ctx.activeUserId){
      const customer = await this.customerService.findOneByUserId(ctx, ctx.activeUserId, true)

      //caso seja passado o token, pega a ordem pelo token, caso contrário pega a que esteja com o active = true (padrão anterior)
      const qb = input.token ? this.connection
      .getRepository(ctx, Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('order.code = :orderToken', { orderToken: input.token })
      .andWhere('order.customerId = :customerId', { customerId: customer?.id })
      : this.connection
      .getRepository(ctx, Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('order.active = true')
      .andWhere('order.customerId = :customerId', { customerId: customer?.id })
      .orderBy('order.id', 'DESC')
    
      const order = await qb.getOne();
      if (!order) {
        return;
      }
      // Ensure the active user is the owner of this Order
      const orderUserId = order.customer && order.customer.user && order.customer.user.id;
      if (order.customer && idsAreEqual(orderUserId, ctx.activeUserId)) {
        return order;
      }
    }
  }
}