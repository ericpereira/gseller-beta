import { Injectable } from '@nestjs/common';
import { ConfigurableOperation, ConfigurableOperationInput } from '@ericpereiraglobalsys/common/lib/generated-types';
import { Type } from '@ericpereiraglobalsys/common/lib/shared-types';

import { ConfigurableOperationDef } from '../../common/configurable-operation';
import { InternalServerError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';

import { IdCodecService } from './id-codec.service';

@Injectable()
export class ConfigurableOperationCodec {
    constructor(private configService: ConfigService, private idCodecService: IdCodecService) {}

    /**
     * Decodes any ID type arguments of a ConfigurableOperationDef
     */
    decodeConfigurableOperationIds<T extends ConfigurableOperationDef<any>>(
        defType: Type<ConfigurableOperationDef<any>>,
        input: ConfigurableOperationInput[],
    ): ConfigurableOperationInput[] {
        const availableDefs = this.getAvailableDefsOfType(defType);
        for (const operationInput of input) {
            const def = availableDefs.find(d => d.code === operationInput.code);
            if (!def) {
                continue;
            }
            for (const arg of operationInput.arguments) {
                const argDef = def.args[arg.name];
                if (argDef && argDef.type === 'ID' && arg.value) {
                    if (argDef.list === true) {
                        const ids = JSON.parse(arg.value) as string[];
                        const decodedIds = ids.map(id => this.idCodecService.decode(id));
                        arg.value = JSON.stringify(decodedIds);
                    } else {
                        const decodedId = this.idCodecService.decode(arg.value);
                        arg.value = JSON.stringify(decodedId);
                    }
                }
            }
        }
        return input;
    }

    /**
     * Encodes any ID type arguments of a ConfigurableOperationDef
     */
    encodeConfigurableOperationIds<T extends ConfigurableOperationDef<any>>(
        defType: Type<ConfigurableOperationDef<any>>,
        input: ConfigurableOperation[],
    ): ConfigurableOperation[] {
        const availableDefs = this.getAvailableDefsOfType(defType);
        for (const operationInput of input) {
            const def = availableDefs.find(d => d.code === operationInput.code);
            if (!def) {
                continue;
            }
            for (const arg of operationInput.args) {
                const argDef = def.args[arg.name];
                if (argDef && argDef.type === 'ID' && arg.value) {
                    if (argDef.list === true) {
                        const ids = JSON.parse(arg.value) as string[];
                        const encodedIds = ids.map(id => this.idCodecService.encode(id));
                        arg.value = JSON.stringify(encodedIds);
                    } else {
                        const encodedId = this.idCodecService.encode(arg.value);
                        arg.value = JSON.stringify(encodedId);
                    }
                }
            }
        }
        return input;
    }

    getAvailableDefsOfType(defType: Type<ConfigurableOperationDef>): ConfigurableOperationDef[] {
        switch (defType) {
            default:
                throw new InternalServerError('error.unknown-configurable-operation-definition', {
                    name: defType.name,
                });
        }
    }
}
