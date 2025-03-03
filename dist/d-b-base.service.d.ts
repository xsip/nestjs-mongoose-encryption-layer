import { HydratedDocument, Model, QueryOptions } from 'mongoose';
export declare class DBBaseService<T> {
    private model;
    constructor(model: Model<T>);
    create(createDto: Partial<T>): Promise<(import("mongoose").Document<unknown, {}, T> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | (import("mongoose").Document<unknown, {}, T> & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })>;
    findAll(): Promise<HydratedDocument<T>[]>;
    findById(id: string): Promise<HydratedDocument<T>>;
    findOne(find: Partial<Record<keyof T, any>>, exclude?: string[]): Promise<HydratedDocument<T>>;
    find(find: Partial<Record<keyof T, any>>, exclude?: string[]): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T> & import("mongoose").Default__v<import("mongoose").Require_id<T>>>[]>;
    findOneAndUpdate(find: Partial<Record<keyof T, any>>, toUpdate: Partial<T>, options?: QueryOptions, exclude?: string[]): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T> & import("mongoose").Default__v<import("mongoose").Require_id<T>>>>;
    deleteOne(find: Partial<Record<keyof T, any>>, exclude?: string[]): Promise<import("mongodb").DeleteResult>;
}
//# sourceMappingURL=d-b-base.service.d.ts.map