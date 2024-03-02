import {Abstract, DynamicModule, ForwardReference, Module, Provider, Type} from "@nestjs/common";
import {CryptoService} from "./crypto.service";

@Module({})
export class EncryptionLayerModule {
    public static forRoot(config: {iv: string; pw: string}): DynamicModule {
        return {
            module: EncryptionLayerModule,
            providers: [
                CryptoService,
                {
                    provide: 'iv',
                    useValue: config.iv,
                },
                {
                    provide: 'pw',
                    useValue: config.pw,
                }
            ]
        }
    }
}