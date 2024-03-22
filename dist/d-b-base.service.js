"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBBaseService = void 0;
const crypto_service_1 = require("./crypto.service");
class DBBaseService {
    constructor(model) {
        this.model = model;
    }
    async create(createDto) {
        const createdEntry = new this.model(createDto);
        return createdEntry.save();
    }
    async findAll() {
        return this.model.find().exec();
    }
    async findById(id) {
        return (await this.model.findById(id).exec());
    }
    async findOne(find, exclude = []) {
        // @ts-ignore
        return this.model.findOne(crypto_service_1.CryptoService.inst.encryptObject(find, ['_id', ...exclude])).exec();
    }
    async find(find, exclude = []) {
        const query = crypto_service_1.CryptoService.inst.encryptObject(find, ['_id', ...exclude]);
        // @ts-ignore
        return this.model.find(query).exec();
    }
    findOneAndUpdate(find, toUpdate, options, exclude = []) {
        return this.model.findOneAndUpdate(crypto_service_1.CryptoService.inst.encryptObject(find, ['_id', ...exclude]), toUpdate, Object.assign({ new: true }, options)).exec();
    }
    deleteOne(find, exclude = []) {
        return this.model.deleteOne(crypto_service_1.CryptoService.inst.encryptObject(find, ['_id', ...exclude])).exec();
    }
}
exports.DBBaseService = DBBaseService;
//# sourceMappingURL=d-b-base.service.js.map