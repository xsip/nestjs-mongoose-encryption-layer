/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { HydratedDocument, Model, QueryOptions } from 'mongoose';
export declare class DBBaseService<T> {
    private model;
    constructor(model: Model<T>);
    create(createDto: Partial<T>): Promise<(import("mongoose").Document<unknown, {}, T> & Required<{
        _id: unknown;
    }>) | (import("mongoose").Document<unknown, {}, T> & {
        _id: import("mongoose").Types.ObjectId;
    })>;
    findAll(): Promise<HydratedDocument<T>[]>;
    findById(id: string): Promise<HydratedDocument<T>>;
    findOne(find: Partial<Record<keyof T, any>>): Promise<HydratedDocument<T>>;
    find(find: Partial<Record<keyof T, any>>): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T> & import("mongoose").Require_id<T>>[]>;
    findOneAndUpdate(find: Partial<Record<keyof T, any>>, toUpdate: Partial<T>, options?: QueryOptions): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T> & import("mongoose").Require_id<T>>>;
    deleteOne(find: Partial<Record<keyof T, any>>): Promise<import("mongodb").DeleteResult>;
}
//# sourceMappingURL=d-b-base.service.d.ts.map