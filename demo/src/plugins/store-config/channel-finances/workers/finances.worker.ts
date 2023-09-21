import {
    Channel,
    ChannelService,
    JobQueue,
    JobQueueService,
    LanguageCode,
    PaymentMethod,
    PaymentMethodService,
    RequestContext,
    RequestContextService,
    TransactionalConnection,
} from '@gseller/core';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { CONNECTED_PAYMENT_METHOD_CODE } from '../../../payments/pagarme/constants';
import { ChannelBankAccount } from '../entities/bank-account.entity';
import { RecipientContractInput } from "@gseller/common/lib/generated-types";

@Injectable()
export class financesWorker implements OnModuleInit {

    //@ts-ignore
    private jobQueue: JobQueue<RecipientContractInput>;

    constructor(
        private jobQueueService: JobQueueService,
        private connection: TransactionalConnection,
        private requestContextService: RequestContextService,
        private paymentMethodService: PaymentMethodService,
        private channelService: ChannelService,
    ) { }

    async onModuleInit() {
        this.jobQueue = await this.jobQueueService.createQueue({
            name: 'recipient-finances',
            process: async job => {

                const updateEntityResult = await this.updateEntity(job.data);

                if (typeof updateEntityResult === 'string') {
                    return updateEntityResult
                }

                const createPaymentMethodResult = await this.createPaymentMethod(job.data);

                console.log(createPaymentMethodResult)

                return job.result
            },
        });
    }

    async main(input: RecipientContractInput) {
        return this.jobQueue.add(input, { retries: 3 });
    }

    async updateEntity(input: RecipientContractInput) {
        try {
            const { channelBankAccountId: id, recipientId } = input
            return this.connection
                .rawConnection
                .getRepository(ChannelBankAccount)
                .update(id, {
                    recipientId,
                    inAnalysis: false,
                });
        } catch (error) {
            return error
        }
    }

    private async createPaymentMethod(input: RecipientContractInput) {

        const { channel, recipientId, owner } = input

        const ctx = await this.requestContextService.create({ apiType: 'admin' });
        const paymentMethod = await this.connection
            .rawConnection
            .getRepository(PaymentMethod)
            .findOne({
                where: {
                    code: CONNECTED_PAYMENT_METHOD_CODE,
                },
            });

        if (!paymentMethod) {
            return
        }

        const createdPaymentMethod = await this.paymentMethodService.create(ctx, {
            code: CONNECTED_PAYMENT_METHOD_CODE,
            enabled: true,
            handler: {
                code: paymentMethod.code,
                arguments: [{
                    name: 'apiKey',
                    value: process.env.PAGARME_SECRET_KEY,

                }, {
                    name: 'recipientId',
                    value: recipientId,
                }, {
                    name: 'channelId',
                    value: channel.id,
                }, {
                    name: 'emailAddress',
                    value: owner.emailAddress,
                },
                {
                    name: 'owner',
                    value: owner.name,
                }
                ],
            },
            translations: [{
                languageCode: LanguageCode.en,
                name: `Payment Method of the store (${channel.code})`,
                description: `GSeller: Payment Method of the store (${channel.code})`,

            },
            {
                languageCode: LanguageCode.pt_BR,
                name: `Método de pagamento da loja (${channel.code})`,
                description: `GSeller: Método de pagamento da loja (${channel.code}) `,
            },
            ]
        });

        await this.channelService.assignToChannels(
            ctx,
            PaymentMethod,
            createdPaymentMethod.id,
            [channel.id as string],
        );
    }

}
