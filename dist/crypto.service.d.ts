export declare class CryptoService {
    private _iv;
    private _password;
    private _initialized;
    private logger;
    isInitialized: () => Promise<unknown>;
    private algorithm;
    private iv;
    private password;
    private cipher;
    private decipher;
    static inst: CryptoService;
    constructor(_iv: string, _password: string);
    init(): void;
    encrypt(text: string): string;
    decrypt(text: string): string;
    private updateDecipher;
    encryptObject<T>(object: T, exclude?: (keyof T | string)[]): T;
    decryptObject<T>(object: T, exclude?: (keyof T | string)[]): T;
    private __cryptObject;
    private updateCypher;
}
//# sourceMappingURL=crypto.service.d.ts.map