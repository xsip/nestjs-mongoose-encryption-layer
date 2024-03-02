"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyEncryptionLayerToSchema = void 0;
const crypto_service_1 = require("./crypto.service");
function fixValuesDeep(input, out) {
    for (const key in input) {
        if (typeof input[key] === 'object') {
            out[key] = fixValuesDeep(input[key], out[key]);
        }
        else {
            out[key] = input[key];
        }
    }
    return out;
}
function applyEncryptionLayerToSchema(Schema, ignoreKey = [
    '_id',
    'id',
    'createdAt',
    'updatedAt',
    '__v',
    '$__parent',
    '$__',
    '$__isNew',
]) {
    Schema.pre('save', function (next) {
        // @ts-ignore
        const model = this;
        // @ts-ignore
        const cpy = crypto_service_1.CryptoService.inst.encryptObject(model.toJSON(), [
            '_id',
            'createdAt',
            'updatedAt',
            'dueDate',
        ]);
        for (const key in cpy) {
            model[key] = cpy[key];
        }
        next();
    });
    Schema.pre('findOneAndUpdate', function (next) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        // @ts-ignore
        const model = this;
        // @ts-ignore
        const cpy = crypto_service_1.CryptoService.inst.encryptObject(model._update, [
            '_id',
            'createdAt',
            'updatedAt',
            'dueDate',
        ]);
        // @ts-ignore
        this._update = cpy;
        next();
    });
    Schema.post('find', (next) => {
        // @ts-ignore
        const cpy = next.map((entry) => {
            entry._doc = crypto_service_1.CryptoService.inst.decryptObject(entry._doc, [
                '_id',
                'createdAt',
                'updatedAt',
                'dueDate',
                '__v',
            ]);
            return entry;
        });
        next = cpy;
    });
    Schema.post('findOne', (next) => {
        if (next) {
            // @ts-ignore
            const cpy = crypto_service_1.CryptoService.inst.decryptObject(next._doc, [
                '_id',
                'id',
                'createdAt',
                'updatedAt',
                'dueDate',
                '__v',
                '$__parent',
                '$__',
                '$__isNew',
            ]);
            next._doc = cpy;
        }
    });
}
exports.applyEncryptionLayerToSchema = applyEncryptionLayerToSchema;
//# sourceMappingURL=mongoose-crypto.helper.js.map