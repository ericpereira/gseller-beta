import { OrderLineInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';
import { In } from 'typeorm';

import { RequestContext } from '../../../api/index';
import { EntityNotFoundError, idsAreEqual } from '../../../common/index';
import { TransactionalConnection } from '../../../connection/index';
import { Order } from '../../../entity/order/order.entity';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { PaymentState } from '../payment-state-machine/payment-state';

/**
 * Returns true if the Order total is covered by Payments in the specified state.
 */
export function orderTotalIsCovered(order: Order, state: PaymentState | PaymentState[]): boolean {
    const paymentsTotal = totalCoveredByPayments(order, state);
    return paymentsTotal >= order.totalWithTax;
}

/**
 * Returns the total amount covered by all Payments (minus any refunds)
 */
export function totalCoveredByPayments(order: Order, state?: PaymentState | PaymentState[]): number {
    const payments = state
        ? Array.isArray(state)
            ? order.payments.filter(p => state.includes(p.state))
            : order.payments.filter(p => p.state === state)
        : order.payments.filter(
              p => p.state !== 'Error' && p.state !== 'Declined' && p.state !== 'Cancelled',
          );
    let total = 0;
    for (const payment of payments) {
        const refundTotal = summate(payment.refunds, 'total');
        total += payment.amount - Math.abs(refundTotal);
    }
    return total;
}

/**
 * Returns true if all OrderItems in the order are cancelled
 */
export function orderLinesAreAllCancelled(order: Order) {
    return order.lines.every(line => line.quantity === 0);
}

export async function getOrdersFromLines(
    ctx: RequestContext,
    connection: TransactionalConnection,
    orderLinesInput: OrderLineInput[],
): Promise<Order[]> {
    const orders = new Map<ID, Order>();
    const lines = await connection.getRepository(ctx, OrderLine).find({
        where: { id: In(orderLinesInput.map(l => l.orderLineId)) },
        relations: ['order', 'order.channels'],
        order: { id: 'ASC' },
    });
    for (const line of lines) {
        const inputLine = orderLinesInput.find(l => idsAreEqual(l.orderLineId, line.id));
        if (!inputLine) {
            continue;
        }
        const order = line.order;
        if (!order.channels.some(channel => channel.id === ctx.channelId)) {
            throw new EntityNotFoundError('Order', order.id);
        }
        if (!orders.has(order.id)) {
            orders.set(order.id, order);
        }
    }
    return Array.from(orders.values());
}
