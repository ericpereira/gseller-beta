import {
  ChannelService,
  ID,
  JobQueue,
  JobQueueService,
  Logger,
  OrderService,
  Payment,
  PaymentMetadata,
  PaymentMethodService,
  PaymentService,
  RequestContext,
  TransactionalConnection,
  SellerService as VendureSellerService,
} from "@ericpereiraglobalsys/core";
import { Injectable, OnModuleInit } from "@nestjs/common";

import { ContextStrategy } from "../context-auth-strategy";
import { OrdersController } from "@gabrielvenegaas/pagarmecoreapilib";

@Injectable()
export class WorkerPaymentPagarmeService implements OnModuleInit {

  private jobQueue: JobQueue<{
    paymentTransaction: string;
    metadata: PaymentMetadata;
    pagarmeOrderId: string;
    orderId: ID;
  }>;

  constructor(
    private channelService: ChannelService,
    private SellersService: VendureSellerService,
    private connection: TransactionalConnection,
    private jobQueueService: JobQueueService,
    private contextStrategy: ContextStrategy,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) { }

  async onModuleInit() {
    this.jobQueue = await this.jobQueueService.createQueue({
      name: "payment-process-pagarme",

      process: async (job) => {
          try {
              const ctx = await this.contextStrategy.createRequestContext();

              //o vendure necessita que todos os pagamentos estejam setados para setar a ordem,
              //então verifica se tem outros payments alem desse e marca como cancelado
              const order = await this.orderService.findOne(ctx, job.data.orderId, ['payments'])
              if(!order) throw Error('Order invalid')
              
              const updateOldPayments = order?.payments.map(async (p) => {
                //marca como cancelados demais pagamentos para poder prosseguir com a order
                if(p.id !== job.data.paymentTransaction && p.state === 'Authorized'){
                  return await this.paymentService.cancelPayment(ctx, p.id)
                }
              })

              Promise.all([updateOldPayments])
              
              //seta o pagamento
              const settlePayment = await this.orderService.settlePayment(ctx, job.data.paymentTransaction)
              
              //atualiza o metadata da order
              await this.orderService.updateCustomFields(ctx, order?.id as ID, {
                pagarmeMetadata: JSON.stringify(job.data.metadata)
              })
              
              //atualiza o metadata do pagamento
              await this.connection.rawConnection.getRepository(Payment).update(
                {
                  id: job.data.paymentTransaction
                }, {
                  metadata: job.data.metadata
                });

              //como o pagamento deu certo, pega o id da ordem e fecha ela na pagarme
              if(job.data.pagarmeOrderId){ //@ts-ignore
                await OrdersController.closeOrder(job.data.pagarmeOrderId, undefined, '', (response) => {
                  //console.log('response', response)
                })
              }

              return {
                  success: true,
                  message: `Payment Webhook Worker Pagarme transacionId: ${job.data.paymentTransaction} has been created`,
              };      
          } catch (error) {
              console.log(error)
              return {
                  success: false,
                  message: 'Payment Webhook Worker Pagarme error'
              };
          }
        
      },
    });
  }

  async main(paymentTransaction: string, metadata: object, pagarmeOrderId: string, orderId: ID) {
      Logger.info(`Pagarme`, `Payment Webhook Worker`);
      //logica à ser adicionada na fila
      if(!paymentTransaction){
          return false
      }
      this.jobQueue.add({ paymentTransaction, metadata, pagarmeOrderId, orderId }, { retries: 2 });
  }

}
