import {CryptoService} from './crypto.service';

function fixValuesDeep(input: any, out: any) {
    for (const key in input) {
        if (typeof input[key] === 'object') {
            out[key] = fixValuesDeep(input[key], out[key]);
        } else {
            out[key] = input[key];
        }
    }
    return out;
}

export function applyEncryptionLayerToSchema(Schema: any, ignoreKey: string[] = []) {
    Schema.pre('save', function (next: any) {
        // @ts-ignore
        const model: any = this;
        // @ts-ignore
        const cpy = CryptoService.inst.encryptObject(model.toJSON(), [
            '_id',
            'createdAt',
            'updatedAt',
            'dueDate',
            ...ignoreKey
        ]);
        for (const key in cpy) {
            (model as any)[key as any] = cpy[key] as any;
        }
        next();
    });

    Schema.pre('findOneAndUpdate', function (next: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        // @ts-ignore
        const model = this;
        // @ts-ignore
        const cpy = CryptoService.inst.encryptObject(model._update, [
            '_id',
            'createdAt',
            'updatedAt',
            'dueDate',
            '$setOnInsert',
            '$set',
            ...ignoreKey
        ]);
        // @ts-ignore
        this._update = cpy;
        next();
    });
    Schema.post('findOneAndUpdate', function (next: any) {
      if (next) {
        // @ts-ignore
        const cpy = CryptoService.inst.decryptObject(next._doc, [
          '_id',
          'id',
          'createdAt',
          'updatedAt',
          'dueDate',
          '__v',
          '$__parent',
          '$__',
          '$__isNew',
            ...ignoreKey
        ]);

        next._doc = cpy;
      }
    });

    Schema.post('find', (next: any[]) => {
        // @ts-ignore
        const cpy = next.map((entry: { _doc: any & { __v: any } }) => {
            entry._doc = CryptoService.inst.decryptObject(entry._doc, [
                '_id',
                'createdAt',
                'updatedAt',
                'dueDate',
                '__v',
                ...ignoreKey
            ]);
            return entry;
        });
        next = cpy;
    });
    Schema.post('findOne', (next: any) => {
        if (next) {
            // @ts-ignore
            const cpy = CryptoService.inst.decryptObject(next._doc, [
                '_id',
                'id',
                'createdAt',
                'updatedAt',
                'dueDate',
                '__v',
                '$__parent',
                '$__',
                '$__isNew',
                ...ignoreKey
            ]);

            next._doc = cpy;
        }
    });
}
