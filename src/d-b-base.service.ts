import {HydratedDocument, Model, QueryOptions} from 'mongoose';
import {CryptoService} from './crypto.service';

export class DBBaseService<T> {
  constructor(private model: Model<T>) {}
  async create(createDto: Partial<T>) {
    const createdEntry = new this.model(createDto);
    return createdEntry.save();
  }

  async findAll(): Promise<HydratedDocument<T>[]> {
    return this.model.find().exec();
  }
  async findById(id: string): Promise<HydratedDocument<T>> {
    return (await this.model.findById(id).exec()) as HydratedDocument<T>;
  }
  async findOne(
    find: Partial<Record<keyof T, any>>,
    exclude: (keyof T | string)[] = []
  ): Promise<HydratedDocument<T>> {
    // @ts-ignore
    return this.model.findOne(
      CryptoService.inst.encryptObject(find, ['_id', ...exclude as string[]])
    ).exec();
  }
  async find(find: Partial<Record<keyof T, any>>,
             exclude: (keyof T | string)[] = []
             ) {
    const query = CryptoService.inst.encryptObject(find, ['_id',...exclude as string[]]);
    // @ts-ignore
    return this.model.find(query).exec();
  }

  findOneAndUpdate(find: Partial<Record<keyof T, any>>, toUpdate: Partial<T>, options?: QueryOptions,
                   exclude: (keyof T | string)[] = []
                   ) {
    return this.model.findOneAndUpdate(
      CryptoService.inst.encryptObject(find, ['_id', ...exclude as string[]]),
      toUpdate, {new: true, ...options}
    ).exec();
  }

  deleteOne(find: Partial<Record<keyof T, any>>,
            exclude: (keyof T | string)[] = []
            ) {
    return this.model.deleteOne(
      CryptoService.inst.encryptObject(find, ['_id', ...exclude as string[]])
    ).exec();
  }
}
