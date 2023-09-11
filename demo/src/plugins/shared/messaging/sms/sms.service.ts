import { Customer, Logger, TransactionalConnection } from "@vendure/core";

import { Injectable } from '@nestjs/common';
import { TempSms } from "./entities/sms-temp.entity";
import api from "./api/axios";

@Injectable()
export class SmsService {
    private logger: Logger;

    constructor(
        private connection: TransactionalConnection,
    ) { }

    private async send(phone: string, msg: string) {
        try {
            Logger.info(`SMS Initialized`, `SMS Service`);

            if (!phone || !msg) {
                throw new Error(`Phone or message is empty`)
            }

            const { status, data } = await api.get(`/v1/send`, {
                params: {
                    number: phone,
                    msg
                }
            })

            Logger.info(`Status: ${data.descricao} Phone: ${phone}`, `SMS Service`);

            return status === 200
        } catch (error) {
            console.log(error)
        }
    }


    async sendCode(phoneNumber: string): Promise<{
        success: boolean,
        message: string
    }> {
        //Send SMS to the phone number
        const customer = await this.connection
            .rawConnection
            .getRepository(Customer)
            .findOne({
                where: {
                    phoneNumber: phoneNumber
                }
            })

        if (!customer) {
            return {
                success: false,
                message: `Não foi possível enviar o código, usuário não encontrado. Tente novamente. `
            }
        }

        //Created sms code 
        const smsCode = this.generateCode();

        //Generate message to send to the phone number
        const msg = this.generateMessage(customer!.firstName, String(smsCode))

        //Send sms code to the phone number
        const wasSent = await this.send(phoneNumber, msg)

        //validate if the code was sent before
        const smsCodeWasSent = await this.connection
            .rawConnection
            .getRepository(TempSms)
            .findOne({
                where: {
                    userId: customer?.user?.id as string,
                    phoneNumber
                }
            })

        if (smsCodeWasSent) {
            //Update the code
            await this.connection
                .rawConnection
                .getRepository(TempSms)
                .update(smsCodeWasSent.id, {
                    code: String(smsCode)
                })

            return {
                success: true,
                message: `Código enviado com sucesso, por favor, verifique seu celular.`
            }
        }

        //Save sms code to the database
        const itWasRegistered = await this.connection
            .rawConnection
            .getRepository(TempSms)
            .save({
                userId: customer?.user?.id as string,
                code: String(smsCode),
                phoneNumber
            })

        if (!itWasRegistered || !wasSent) {
            return {
                success: false,
                message: `Não foi possível enviar o código para o número ${phoneNumber}, tente novamente.`
            }
        }

        return {
            success: true,
            message: `Código enviado com sucesso, por favor, verifique seu celular.`
        }
    }

    //generate random code
    private generateCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    //generate message to send to the phone number
    private generateMessage(name: string, code: string) {
        return `
Olá, ${name.substring(0, 1).toUpperCase().concat(name.substring(1))} seu código de verificação para acessar nossa plataforma é: ${code}.

Lembre-se de não compartilhar este código com ninguém. Se você não solicitou este código, por favor, ignore esta mensagem.

Qualquer dúvida, estamos à disposição para ajudar.

Atenciosamente,
Happen
        `
    }

}