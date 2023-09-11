import { Asset, AssetService, Customer, EventBus, ID, OrderService, RequestContext, TransactionalConnection, isGraphQlErrorResult } from "@vendure/core";

import { FindOneOptions } from "typeorm";
import { Injectable } from '@nestjs/common';
import { InputCreateRefundRequest } from "../types";
import { RefundRequest } from "../entities/refund-request.entity";
//@ts-ignore 
import { RefundRequestEvent } from "../../../../event-bus/events/refund-order.event";

@Injectable()
export class RefundRequestAdminService {
    constructor(
        private connection: TransactionalConnection,
        private orderService: OrderService,
        private assetService: AssetService,
        private eventBus: EventBus,
    ) { }

    protected async getData(ctx: RequestContext, orderCode: string, isNew = false) {
        const order = await this.orderService.findOneByCode(ctx, orderCode, ['customer', 'payments'])
        if (!order) throw new Error("Order not found")

        if (isNew) { //verifica se a solicitação pra essa ordem já existe
            const oldRequest = await this.connection.rawConnection.getRepository(RefundRequest).findOne({
                where: {
                    orderId: order.id as number
                }
            })
            if (oldRequest) throw new Error("Request already created")
        }

        const payment = order.payments.filter(p => p.state === 'Settled')[0]
        if (!payment) throw new Error('Payment Settled not found')
        return { order, payment }
    }

    protected async getRefundRequest(ctx: RequestContext, id: ID) {
        const refund = await this.connection.rawConnection.getRepository(RefundRequest).findOne({
            where: {
                id,
                channelId: ctx.channelId
            },
            relations: ['customer', 'order', 'payment', 'channel']
        });

        return refund
    }

    async getAssets(ctx: RequestContext, assets: number[] | undefined) {
        return assets && assets.length > 0
            ? await Promise.all(
                assets?.map(async (assetId) => {
                    const options: FindOneOptions<Asset> = {
                        where: {
                            id: assetId,
                        },
                    };

                    const assetEntity = await this.connection
                        .getRepository(ctx, Asset)
                        .findOne(options);
                    if (assetEntity) {
                        return assetEntity;
                    }
                    throw new Error(`Asset with id ${assetId} not found`);
                })
            )
            : [];
    }

    async create(ctx: RequestContext, input: InputCreateRefundRequest) {
        try {
            const { orderCode, reason, nfeKey, nfePdf, assets } = input
            const { order, payment } = await this.getData(ctx, orderCode, true)

            const myAssets: any = []
            let assetNfePdf: any
            if (nfePdf) { //caso tenha enviado o arquivo da nota em pdf
                assetNfePdf = await this.uploadFile(ctx, { file: nfePdf })
            } else {
                throw Error('NFE pdf file is mandatory')
            }

            if (assets && assets.length > 0) { //caso tenha enviado as fotos do produto
                for (let i = 0; i < assets.length; i++) {
                    const newAsset = await this.uploadFile(ctx, { file: assets[i] })
                    myAssets.push(newAsset)
                }
            }

            const refundRequest: Partial<RefundRequest> = {
                orderId: order.id,
                paymentId: payment.id,
                customerId: order.customer?.id,
                status: "Pending",
                channelId: ctx.channelId,
                reason,
                nfeKey,
                nfePdfId: assetNfePdf?.id,
                assets: myAssets
            }

            const refundRequestCreated = await this.connection.rawConnection
                .getRepository(RefundRequest)
                .save(refundRequest);

            if (refundRequestCreated) {
                this.eventBus.publish(
                    new RefundRequestEvent(
                        ctx,
                        {
                            refundRequest: { ...refundRequestCreated, customer: order.customer as Customer, order },
                        },
                        "created"
                    )
                );
            }

            return refundRequestCreated;

        } catch (error) {
            console.log(error)
            return error
        }
    }

    async findAll(ctx: RequestContext, customerId?: ID) {
        try {
            return this.connection.rawConnection.getRepository(RefundRequest).find(customerId ? {
                where: {
                    customerId,
                    channelId: ctx.channelId
                },
                relations: ['order', 'customer', 'payment', 'channel', 'assets', 'nfePdf'],
                order: {
                    id: 'DESC'
                }
            } : {
                where: {
                    channelId: ctx.channelId
                },
                relations: ['order', 'customer', 'payment', 'channel', 'assets', 'nfePdf'],
                order: {
                    id: 'DESC'
                }
            })
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async find(ctx: RequestContext, id: ID) {
        try {
            return this.getRefundRequest(ctx, id);
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async update(ctx: RequestContext, id: ID, data: Partial<RefundRequest>) {
        try {
            const refundRequest = await this.connection.rawConnection.getRepository(RefundRequest).findOne({
                where: {
                    id,
                    channelId: ctx.channelId
                }
            })

            if (!refundRequest) throw new Error('Refund request not found')

            const order = await this.orderService.findOne(ctx, refundRequest?.orderId as ID)
            await this.getData(ctx, order?.code as string)

            const updated = await this.connection.rawConnection.getRepository(RefundRequest).update(refundRequest?.id as ID, { ...data })

            //faz o refund da order
            if (!!updated && data.status === 'Settled' && refundRequest.status !== 'Settled') {
                await this.orderService.transitionToState(ctx, order?.id as ID, 'PaymentRefunded')
            }

            if (!!updated && data.status === "Settled") {
                this.eventBus.publish(
                    //manda o objeto atualizado pra n precisar consultar o banco novamente
                    new RefundRequestEvent(
                        ctx,
                        { refundRequest: { ...refundRequest, ...data } },
                        "approved"
                    )
                );
            }

            if (!!updated && data.status === "Failed") {
                this.eventBus.publish(
                    new RefundRequestEvent(
                        ctx,
                        { refundRequest: { ...refundRequest, ...data } },
                        "denied"
                    )
                );
            }

            return !!updated
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async delete(ctx: RequestContext, id: ID) {
        try {
            const refundRequest = await this.connection.rawConnection.getRepository(RefundRequest).findOne({
                where: {
                    id,
                    channelId: ctx.channelId
                }
            })

            if (!refundRequest) throw new Error('Refund request not found')

            const order = await this.orderService.findOne(ctx, refundRequest?.orderId as ID)
            await this.getData(ctx, order?.code as string)

            const deleted = await this.connection.rawConnection.getRepository(RefundRequest).delete(refundRequest?.id as number)
            return !!deleted
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async uploadFile(ctx: RequestContext, args: any) {
        const userId = ctx.activeUserId;

        if (!userId) {
            return;
        }

        // Create an Asset from the uploaded file
        const asset = await this.assetService.create(ctx, {
            file: args.file,
            tags: ['refund_request_file'],
        });

        // Check to make sure there was no error when
        // creating the Asset
        if (isGraphQlErrorResult(asset)) {
            // MimeTypeError
            throw asset;
        }

        return asset;
    }
}