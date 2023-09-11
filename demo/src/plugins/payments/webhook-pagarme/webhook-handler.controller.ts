import { Controller, Post, Req, Res, Body, HttpStatus } from '@nestjs/common';
import { Ctx, OrderService, RequestContext, Order } from '@vendure/core';
import { Response } from 'express';
import { WorkerPaymentPagarmeService } from '../worker-payment-process';
import { WorkerPaymentFailedPagarmeService } from '../worker-payment-process/payment-failed-process';

type CustomOrderFields = {
  orderCode?: string;
  pagarmeOrderId?: string;
  pagarmeQrcode?: string;
  pagarmeBoletoUrl?: string;
  pagarmePaymentType?: string;
}

@Controller('webhook-pagarme')
export class WebhookPagarmeController {
  constructor(
    private orderService: OrderService,
    private workerPaymentPagarMeService: WorkerPaymentPagarmeService,
    private workerPaymentFailedPagarmeService: WorkerPaymentFailedPagarmeService
  ) { }

  @Post()
  async findAll(
    @Ctx() ctx: RequestContext,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any) {

    if (body && body.id) {

      //ordem paga com sucesso
      if (body.type === 'order.paid') {
        const orderCode = body.data.code;
        const order: Order | undefined = await this.orderService.findOneByCode(ctx, orderCode, ['payments']);

        //caso não encontre a order na nossa base, retorna um erro
        if (!order) res.status(HttpStatus.BAD_REQUEST).send();

        //caso a order esteja no estado de esperando a confirmação de pagamento
        if (order?.state === 'PaymentAuthorized') {
          //verifica se houve mais de uma tentativa de pagamento, se sim, pega a primeira com status = paid, caso contrário retorna a única tentativa
          const charge = body.data.charges.length > 1 ? body.data.charges.filter((c: any) => c.status === 'paid') : body.data.charges[0]

          //busca no vetor de pagamentos da order, qual é a transaction que está sendo emitida pelo webhook da pagarme
          const paymentTransaction = order?.payments?.filter(p => p.transactionId === charge.id)[0]
          const customFields: CustomOrderFields = order.customFields
          
          //caso exista essa transaction, muda a order para o status pago
          if (paymentTransaction && customFields.pagarmeOrderId) {
            const jobReponse = this.workerPaymentPagarMeService.main(
              paymentTransaction.id as string,
              body.data,
              customFields.pagarmeOrderId,
              order.id)

            if (!jobReponse) res.status(HttpStatus.BAD_REQUEST).send()

            res.status(HttpStatus.OK).send()
          }
        }
      }

      //charge (novo pagamento) realizado com sucesso
      if (body.type === 'charge.paid') {
        const orderCode = body.data.order.code;
        const order = await this.orderService.findOneByCode(ctx, orderCode, ['payments']);

        //caso não encontre a order na nossa base, retorna um erro
        if (!order) res.status(HttpStatus.BAD_REQUEST).send();

        //caso a order esteja no estado de esperando a confirmação de pagamento
        if (order?.state === 'PaymentAuthorized') {
          //verifica se houve mais de uma tentativa de pagamento, se sim, pega a primeira com status = paid, caso contrário retorna a única tentativa
          const charge = body.data

          //busca no vetor de pagamentos da order, qual é a transaction que está sendo emitida pelo webhook da pagarme
          const paymentTransaction = order?.payments?.filter(p => p.transactionId === charge.id)[0]
          const customFields: CustomOrderFields = order.customFields

          //caso exista essa transaction, muda a order para o status pago
          if (paymentTransaction && customFields.pagarmeOrderId) {
            const jobReponse = this.workerPaymentPagarMeService.main(
              paymentTransaction.id as string,
              body.data,
              customFields.pagarmeOrderId,
              order.id)

            if (!jobReponse) res.status(HttpStatus.BAD_REQUEST).send()

            res.status(HttpStatus.OK).send()
          }
        }
      }

      //falha ao pagar ordem
      if (body.type === 'order.payment_failed' || body.type === 'charge.payment_failed') {
        const orderCode = body.data.code;
        const order = await this.orderService.findOneByCode(ctx, orderCode, ['payments']);

        //caso não encontre a order na nossa base, retorna um erro
        if (!order) res.status(HttpStatus.BAD_REQUEST).send();

        //caso a order esteja no estado de esperando a confirmação de pagamento
        if (order?.state === 'PaymentAuthorized') {
          const jobReponse = this.workerPaymentFailedPagarmeService.main(order.id, body.data)

          if (!jobReponse) res.status(HttpStatus.BAD_REQUEST).send()

          res.status(HttpStatus.OK).send()
        }
      }

      res.status(HttpStatus.BAD_REQUEST).send();
    } else {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }
}