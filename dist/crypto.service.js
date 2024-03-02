"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CryptoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const mongoose_1 = require("mongoose");
let CryptoService = CryptoService_1 = class CryptoService {
    constructor(_iv, _password) {
        this._iv = _iv;
        this._password = _password;
        this._initialized = false;
        this.logger = new common_1.Logger(CryptoService_1.name);
        this.isInitialized = () => new Promise((resolve) => {
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
        this.algorithm = 'aes-256-cbc';
        if (!CryptoService_1.inst) {
            this.init();
            CryptoService_1.inst = this;
        }
        else {
            return CryptoService_1.inst;
        }
        return CryptoService_1.inst;
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
        }
        catch (e) {
            this.logger.error(`Error Initializing Crypto service!! `, e);
            process.exit(1);
        }
    }
    encrypt(text) {
        this.updateCypher();
        let encryptedData = this.cipher.update(text, 'utf-8', 'hex');
        encryptedData += this.cipher.final('hex');
        return encryptedData;
    }
    decrypt(text) {
        this.updateDecipher();
        let decryptedData = this.decipher.update(text, 'hex', 'utf-8');
        decryptedData += this.decipher.final('utf8');
        return decryptedData;
    }
    updateDecipher() {
        this.decipher = crypto.createDecipheriv(this.algorithm, this.password, this.iv);
    }
    // only encrypting string properties!!
    encryptObject(object, exclude) {
        return this.__cryptObject(object, exclude !== null && exclude !== void 0 ? exclude : [], 'encrypt');
    }
    // only decrypting string properties!!
    decryptObject(object, exclude) {
        return this.__cryptObject(object, exclude !== null && exclude !== void 0 ? exclude : [], 'decrypt');
    }
    // only crypting string properties!!
    __cryptObject(object, exclude, type) {
        const newObj = Object.assign({}, object);
        if (Object.keys(object).includes('_doc')) {
            object._doc = this.__cryptObject(object._doc, exclude, type);
        }
        else {
            for (const key in object) {
                try {
                    if (object[key] === null || object[key] === undefined) {
                        newObj[key] = object[key];
                    }
                    else if (typeof object[key] === 'number') {
                        this.logger.log(`Excludeing ${key} since it is a number ${object[key]}`);
                    }
                    else if (!exclude.includes(key) &&
                        mongoose_1.Types.ObjectId.isValid(object[key]) && // check if is doc!! mongodb returns isValidObjId for documents.
                        !object[key]._doc) {
                        newObj[key] =
                            type === 'encrypt'
                                ? this.encrypt(object[key].toString())
                                : this.decrypt(object[key].toString());
                    }
                    else if (!(exclude === null || exclude === void 0 ? void 0 : exclude.includes(key)) &&
                        typeof object[key] === 'string') {
                        newObj[key] =
                            type === 'encrypt'
                                ? this.encrypt(object[key])
                                : this.decrypt(object[key]);
                    }
                    else if (!(exclude === null || exclude === void 0 ? void 0 : exclude.includes(key)) &&
                        typeof object[key] === 'object') {
                        if (Array.isArray(object[key])) {
                            newObj[key] = object[key].map((entry) => {
                                if (entry._doc) {
                                    entry._doc = this.__cryptObject(entry._doc, exclude, type);
                                    return entry;
                                }
                                return this.__cryptObject(entry, exclude, type);
                            });
                        }
                        else {
                            if (object[key]._doc) {
                                newObj[key] = object[key];
                                newObj[key]._doc = this.__cryptObject(object[key]._doc, exclude, type);
                            }
                            else {
                                if (object[key] === 'activeInvoice') {
                                }
                                newObj[key] = this.__cryptObject(object[key], exclude, type);
                            }
                        }
                    }
                }
                catch (e) {
                    this.logger.warn(`Decryption for "${key}" failed.`, typeof object[key], e);
                }
            }
        }
        return newObj;
    }
    updateCypher() {
        this.cipher = crypto.createCipheriv(this.algorithm, this.password, this.iv);
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = CryptoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('iv')),
    __param(1, (0, common_1.Inject)('pw')),
    __metadata("design:paramtypes", [String, String])
], CryptoService);
//# sourceMappingURL=crypto.service.js.map