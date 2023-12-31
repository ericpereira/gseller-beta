import type { PaymentState } from "@ericpereiraglobalsys/core";
import { RefundState } from "@ericpereiraglobalsys/core/dist/service/helpers/refund-state-machine/refund-state";
// @ts-ignore
import type { Transaction, Refund } from "pagarme";

const mapPGTransactionsStateToPaymentStatus: {
  [key in Transaction["status"]]: Exclude<PaymentState, "Error">;
} = {
  processing: "Created",
  authorized: "Authorized",
  paid: "Settled",
  refunded: "Settled",
  pending_refund: "Settled",
  refused: "Declined",
  chargedback: "Settled",
  analyzing: "Created",
  pending_review: "Created",
};

const mapPGRefundStateToRefundStatus: {
  [key in Refund["status"]]: RefundState;
} = {
  refunded: "Settled",
  pending_refund: "Pending",
};

export function getPaymentStateByPGTransactionStatus(
  status: Transaction["status"]
): Exclude<PaymentState, "Error"> {
  return mapPGTransactionsStateToPaymentStatus[status];
}

export function getRefundStateByPGRefundStatus(
  status: Refund["status"]
): RefundState {
  return mapPGRefundStateToRefundStatus[status];
}
