import {
    Configuration,
    GetRecipientResponse,
    RecipientsController
} from "@gabrielvenegaas/pagarmecoreapilib";
import {
    EventBus,
    JobQueue,
    JobQueueService,
    Logger,
} from '@gseller/core';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PaymentAccountInput, RecipientContractInput } from "@gseller/common/lib/generated-types";

import { RecipientContractEvent } from '../../../event-bus/events/recipient-contract-event';
import { normalizeString } from '@gseller/common/lib/normalize-string';

@Injectable()
export class RecipientContractServices implements OnModuleInit {

    //@ts-ignore
    private jobQueue: JobQueue<PaymentAccountInput>;

    constructor(
        private jobQueueService: JobQueueService,
        private eventBus: EventBus
    ) {
        Configuration.basicAuthUserName =
            process.env.PAGARME_SECRET_KEY || "sk_test_Lzpa6lVu5Fj50Wre";
        Configuration.basicAuthPassword =
            process.env.PAGARME_PUBLIC_KEY || "pk_test_7x4gAYYu4GCMgPkO";
    }

    async onModuleInit() {
        this.jobQueue = await this.jobQueueService.createQueue({
            name: 'recipient-request',
            process: async job => {

                const createRecipientResult = await this.createRecipient(job.data);

                if (typeof createRecipientResult === 'string') {
                    Logger.error(`Pagarme`, `Recipient Request Error`, createRecipientResult);
                    return createRecipientResult
                }

                this.publishEvent({
                    channel: job.data.channel,
                    channelBankAccountId: job.data.id,
                    recipientId: createRecipientResult.id,
                    owner: {
                        emailAddress: job.data.email,
                        name: job.data.name
                    }
                });

                return job.result
            },
        });
    }

    async main(input: PaymentAccountInput) {
        Logger.info(`Pagarme`, `Recipient Request`);
        return this.jobQueue.add(input, { retries: 3 });
    }

    private async createRecipient({
        name,
        email,
        description,
        document,
        type,
        code,
        defaultBankAccount,
        channel
    }: PaymentAccountInput): Promise<GetRecipientResponse | string> {

        const {
            bank,
            branchNumber,
            branchCheckDigit,
            accountNumber,
            accountCheckDigit,
        } = defaultBankAccount

        try {
            const shopName = this.getChannelCode(channel.code);

            const recipients: GetRecipientResponse = await RecipientsController.createRecipient({
                name: shopName,
                email,
                description,
                document,
                type,
                code: channel.token, //single external reference
                default_bank_account: {
                    holder_name: name,
                    holder_document: document,
                    holder_type: 'individual',
                    bank,
                    branch_number: branchNumber,
                    branch_check_digit: branchCheckDigit,
                    account_number: accountNumber,
                    account_check_digit: accountCheckDigit,
                    type: 'savings' // Type gives account possive values: "checking" or "savings"

                },
                transfer_settings: {
                    transfer_enabled: true,
                    transfer_interval: 'Daily',
                    transfer_day: 0
                }, //TO DO: make this configurable
            });

            return recipients

        } catch (error: any) {
            return JSON.stringify(error)
        }
    }

    private getChannelCode(shopName: string) {
        return normalizeString(shopName, '-');
    }

    private publishEvent(data: RecipientContractInput) {
        return this.eventBus.publish(
            new RecipientContractEvent({
                ...data,
            })
        );
    }

}
