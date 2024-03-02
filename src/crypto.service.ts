import {Inject, Injectable, Logger} from '@nestjs/common';
import * as crypto from 'crypto';
import {Types} from 'mongoose';

@Injectable()
export class CryptoService {
    private _initialized = false;
    private logger: Logger = new Logger(CryptoService.name);
    public isInitialized = () =>
        new Promise((resolve) => {
            if (this._initialized) {
                resolve(this._initialized);
                return;
            }

            const intervalId = setInterval(() => {
                if (this._initialized) {
                    clearInterval(intervalId);
                    resolve(this._initialized);
                }
            }, 1000);
        });

    private algorithm = 'aes-256-cbc';

    private iv!: Buffer; //  = Buffer.from('bcfba55b8c312852a25f39d6bdcd6beb', 'hex'); // crypto.randomBytes(16);
    private password!: Buffer; // = Buffer.from('6c04dfe86459a366352b59a366352b97', 'utf8');

    private cipher!: crypto.Cipher;
    private decipher!: crypto.Decipher;

    public static inst: CryptoService;

    constructor(@Inject('iv') private _iv: string,
                @Inject('pw') private _password: string) {
        if (!CryptoService.inst) {
            this.init();
            CryptoService.inst = this;
        } else {
            return CryptoService.inst;
        }
        return CryptoService.inst;
    }

    init() {
        try {
            this._initialized = true;
            this.iv = Buffer.from(this._iv, 'hex'); // crypto.randomBytes(16);
            this.password = Buffer.from(this._password, 'utf8');

            this.updateDecipher();
            this.updateCypher();
            this._iv = null;
            this._password = null;
            this.logger.log('Secrets Initialized');
        } catch (e) {
            this.logger.error(`Error Initializing Crypto service!! `, e);
            process.exit(1);
        }
    }
    encrypt(text: string) {
        this.updateCypher();
        let encryptedData = this.cipher.update(text, 'utf-8', 'hex');
        encryptedData += this.cipher.final('hex');
        return encryptedData;
    }

    decrypt(text: string) {
        this.updateDecipher();
        let decryptedData = this.decipher.update(text, 'hex', 'utf-8');
        decryptedData += this.decipher.final('utf8');
        return decryptedData;
    }

    private updateDecipher() {
        this.decipher = crypto.createDecipheriv(
            this.algorithm,
            this.password,
            this.iv
        );
    }

    // only encrypting string properties!!
    public encryptObject<T>(object: T, exclude?: (keyof T | string)[]): T {
        return this.__cryptObject(object, exclude ?? [], 'encrypt');
    }

    // only decrypting string properties!!
    public decryptObject<T>(object: T, exclude?: (keyof T | string)[]): T {
        return this.__cryptObject(object, exclude ?? [], 'decrypt');
    }

    // only crypting string properties!!
    private __cryptObject(
        object: any,
        exclude: (keyof any)[],
        type: 'encrypt' | 'decrypt'
    ) {
        const newObj: any = {...object};
        if (Object.keys(object).includes('_doc')) {
            object._doc = this.__cryptObject(object._doc, exclude, type);
        } else {
            for (const key in object) {
                try {
                    if (object[key] === null || object[key] === undefined) {
                        newObj[key] = object[key];
                    } else if (typeof object[key] === 'number') {
                        this.logger.log(
                            `Excludeing ${key} since it is a number ${object[key]}`
                        );
                    } else if (
                        !(exclude as string[]).includes(key) &&
                        Types.ObjectId.isValid(object[key]) && // check if is doc!! mongodb returns isValidObjId for documents.
                        !object[key]._doc
                    ) {
                        newObj[key] =
                            type === 'encrypt'
                                ? this.encrypt(object[key as any].toString() as string)
                                : this.decrypt((object[key] as any).toString() as string);
                    } else if (
                        !(exclude as string[])?.includes(key) &&
                        typeof object[key] === 'string'
                    ) {
                        newObj[key] =
                            type === 'encrypt'
                                ? (this.encrypt(object[key] as any) as string)
                                : this.decrypt(object[key] as any as string);
                    } else if (
                        !(exclude as string[])?.includes(key) &&
                        typeof object[key] === 'object'
                    ) {
                        if (Array.isArray(object[key])) {
                            newObj[key] = object[key].map((entry: any) => {
                                if (entry._doc) {
                                    entry._doc = this.__cryptObject(entry._doc, exclude, type);
                                    return entry;
                                }
                                return this.__cryptObject(entry, exclude, type);
                            });
                        } else {
                            if (object[key as unknown as any]._doc) {
                                newObj[key] = object[key];
                                newObj[key]._doc = this.__cryptObject(
                                    object[key as unknown as any]._doc as any,
                                    exclude,
                                    type
                                );
                            } else {
                                if (object[key] === 'activeInvoice') {
                                }
                                newObj[key] = this.__cryptObject(
                                    object[key as unknown as any] as any,
                                    exclude,
                                    type
                                );
                            }
                        }
                    }
                } catch (e) {
                    this.logger.warn(
                        `Decryption for "${key}" failed.`,
                        typeof object[key],
                        e
                    );
                }
            }
        }
        return newObj;
    }

    private updateCypher() {
        this.cipher = crypto.createCipheriv(this.algorithm, this.password, this.iv);
    }
}
