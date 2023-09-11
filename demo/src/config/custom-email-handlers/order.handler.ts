import { OrderStateTransitionEvent } from "@vendure/core";
import { EmailEventListener } from "@vendure/email-plugin";

export const receiptedOrderHandler = new EmailEventListener("receipted-order")
  .on(OrderStateTransitionEvent)
  .filter((event) => event.toState === "ArrangingPayment")
  .setRecipient((event) => event.order.customer?.emailAddress!)
  .setFrom(`{{ fromAddress }}`)
  .setSubject("Pedido recebido")
  .setTemplateVars((event) => {
    return {
      orderCode: event.order.id,
      createdAt: event.order.createdAt.toLocaleDateString("pt-BR"),
    };
  });

export const orderConfirmedHandler = new EmailEventListener("order-confirmed")
  .on(OrderStateTransitionEvent)
  .filter((event) => event.toState === "PaymentSettled")
  .setRecipient((event) => event.order.customer?.emailAddress!)
  .setFrom(`{{ fromAddress }}`)
  .setSubject("Pedido confirmado")
  .setTemplateVars((event) => ({
    orderCode: event.order.id,
    createdAt: event.order.createdAt.toLocaleDateString("pt-BR"),
  }));

export const orderDeliveryHandler = new EmailEventListener("order-delivery")
  .on(OrderStateTransitionEvent)
  .filter((event) => event.toState === "Shipped")
  .setRecipient((event) => event.order.customer?.emailAddress!)
  .setFrom(`{{ fromAddress }}`)
  .setSubject("Pedido a caminho")
  .setTemplateVars((event) => ({
    orderCode: event.order.id,
    createdAt: event.order.createdAt.toLocaleDateString("pt-BR"),
  }));

export const orderConcludedHandler = new EmailEventListener("order-concluded")
  .on(OrderStateTransitionEvent)
  .filter((event) => event.toState === "Delivered")
  .setRecipient((event) => event.order.customer?.emailAddress!)
  .setFrom(`{{ fromAddress }}`)
  .setSubject("Pedido entregue")
  .setTemplateVars((event) => ({
    orderCode: event.order.id,
    createdAt: event.order.createdAt.toLocaleDateString("pt-BR"),
  }));
