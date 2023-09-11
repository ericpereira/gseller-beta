import {
    ChannelService,
    ID,
    JobQueue,
    JobQueueService,
    Logger,
    OrderService,
    PaymentMetadata,
    TransactionalConnection,
    SellerService as VendureSellerService,
  } from "@vendure/core";
  import { Injectable, OnModuleInit } from "@nestjs/common";
  
import { ContextStrategy } from "../context-auth-strategy";

  @Injectable()
  export class WorkerPaymentFailedPagarmeService implements OnModuleInit {
  
    private jobQueue: JobQueue<{
      orderId: ID,
      metadata: PaymentMetadata
    }>;
  
    constructor(
      private jobQueueService: JobQueueService,
      private contextStrategy: ContextStrategy,
      private orderService: OrderService
    ) { }
  
    async onModuleInit() {
      this.jobQueue = await this.jobQueueService.createQueue({
        name: "payment-failed-process-pagarme",
  
        process: async (job) => {
            try {
                const ctx = await this.contextStrategy.createRequestContext();

                const order = await this.orderService.findOne(ctx, job.data.orderId)
                if(!order) throw Error('Order invalid')

                //atualiza o metadata da order
                await this.orderService.updateCustomFields(ctx, order?.id as ID, {
                  pagarmeMetadata: JSON.stringify(job.data.metadata)
                })
                
                //muda o status da order
                await this.orderService.transitionToState(ctx, job.data.orderId, 'PaymentFailed')

                return {
                    success: true,
                    message: `Payment Failed Webhook Worker Pagarme transacionId: ${job.data.orderId} has been created`,
                };      
            } catch (error) {
                console.log(error)
                return {
                    success: false,
                    message: 'Payment Failed Webhook Worker Pagarme error'
                };
            }
          
        },
      });
    }
  
    async main(orderId: ID, metadata: object) {
        Logger.info(`Pagarme`, `Payment Failed Webhook Worker`);
        //logica à ser adicionada na fila
        if(!orderId){
            return false
        }
        this.jobQueue.add({ orderId, metadata }, { retries: 2 });
    }
  
  }
  