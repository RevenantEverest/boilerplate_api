import { BaseEntity, EntityTarget, DeepPartial, FindOneOptions, FindManyOptions, QueryFailedError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';

import AppDataSource from '../db/dataSource.js';

import type { OperationReturn, IndexOptions } from '@@types/entities.js';
import type { HandleReturn } from '@@types/promises.js';

import * as promises from './promises.js';
import { DEFAULTS, ERROR_MESSAGES } from '@@constants/index.js';

type Target<T> = EntityTarget<T>;
type Data<T> = DeepPartial<T>;

export async function count<T extends BaseEntity>(entity: Target<T>, findOptions?: FindManyOptions<T>): Promise<HandleReturn<number>> {
    const repository = AppDataSource.getRepository(entity);

    try {
        const count = await repository.count(findOptions);
        return [count, undefined];
    }
    catch(err) {
        const error = err as QueryFailedError;
        return [undefined, error];
    }
};

export async function destroy<T extends BaseEntity>(entity: Target<T>, data: Data<T>): Promise<HandleReturn<T>> {
    const repository = AppDataSource.getRepository(entity);

    try {
        const entityObj = repository.create(data);
        const res = await repository.remove(entityObj);
        return [res, undefined];
    }
    catch(err) {
        const error = err as QueryFailedError;
        return [undefined, error];
    }
};

export async function find<T extends BaseEntity>(entity: Target<T>, findOptions: FindOneOptions<T>, options?: IndexOptions): Promise<HandleReturn<T[]>> {

    const repository = AppDataSource.getRepository(entity);

    const findManyOptions: FindManyOptions<T> = {
        ...findOptions,
        skip: options?.offset ?? 0
    };

    if(options?.limit && options.limit > 0) {
        findManyOptions.take = options.limit;
    }

    const promise = repository.find(findManyOptions);
    const [res, err] = await promises.handle<T[]>(promise);

    if(err) {
        return [undefined, err];
    }

    return [res, undefined];
};

export async function findAndCount<T extends BaseEntity>(entity: Target<T>, findOptions: FindOneOptions<T>, options?: IndexOptions): Promise<HandleReturn<[T[], number]>> {

    const repository = AppDataSource.getRepository(entity);

    const findManyOptions: FindManyOptions<T> = {
        ...findOptions,
        skip: options?.offset ?? 0
    };

    if(options?.limit && options.limit > 0) {
        findManyOptions.take = options.limit;
    }

    const promise = repository.findAndCount(findManyOptions);
    const [res, err] = await promises.handle<[T[], number]>(promise);

    if(err) {
        return [undefined, err];
    }

    return [res, undefined];
};

export async function findOne<T extends BaseEntity>(entity: Target<T>, findOptions: FindOneOptions<T>): Promise<HandleReturn<T>> {

    const repository = AppDataSource.getRepository(entity);

    const promise = repository.findOne(findOptions);
    const [res, err] = await promises.handle<T | null>(promise);

    if(err) {
        return [undefined, err];
    }

    return [res, undefined];
};

export async function findAndSaveOrUpdate<T extends BaseEntity>(entity: Target<T>, findOptions: FindOneOptions<T>, data: Data<T>): Promise<HandleReturn<T>> {

    const [res, err] =  await findOne<T>(entity, findOptions);

    if(err) {
        return [undefined, err];
    }

    if(!res) {
        return await insert(entity, data);
    }

    return await save(entity, res as Data<T>);
};

export async function findAndUpdate<T extends BaseEntity>(entity: Target<T>, findOptions: FindOneOptions<T>, data: Data<T>): OperationReturn<T> {

    const repository = AppDataSource.getRepository(entity);
    
    const [findRes, findErr] = await findOne<T>(entity, findOptions);

    if(findErr || !findRes) {
        return [undefined, findErr];
    }

    if(!findRes) {
        return [undefined, new Error(ERROR_MESSAGES.ENTITY_NOT_FOUND)]
    }

    const entityObj = repository.create({
        ...findRes,
        ...data
    });

    return await save<T>(entity, (entityObj as Data<T>));
};

export async function findOrSave<T extends BaseEntity>(entity: Target<T>, findOptions: FindOneOptions<T>, data: Data<T>): Promise<HandleReturn<T>> {

    const repository = AppDataSource.getRepository(entity);

    const [res, err] = await findOne<T>(entity, findOptions);

    if(err) {
        return [undefined, err];
    }

    if(!res) {
        return await insert(entity, data);
    }

    const entityObj = repository.create(res as Data<T>);
    return [entityObj, undefined];
};

export async function index<T extends BaseEntity>(entity: Target<T>, options: IndexOptions): Promise<HandleReturn<T[]>> {

    const repository = AppDataSource.getRepository(entity);

    const promise = repository.find({
        skip: options.offset ?? 0,
        take: options.limit ?? DEFAULTS.LIMIT
    });
    const [res, err] = await promises.handle<T[]>(promise);

    if(err) {
        return [undefined, err];
    }

    return [res, undefined];
};

export async function indexAndCount<T extends BaseEntity>(entity: Target<T>, options: IndexOptions): Promise<HandleReturn<[T[], number]>> {

    const repository = AppDataSource.getRepository(entity);

    const promise = repository.findAndCount({
        skip: options.offset ?? 0,
        take: options.limit ?? DEFAULTS.LIMIT
    });
    const [res, err] = await promises.handle<[T[], number]>(promise);

    if(err) {
        return [undefined, err];
    }

    return [res, undefined];
};

export async function insert<T extends BaseEntity>(entity: Target<T>, data: Data<T>): OperationReturn<T> {

    try {
        return await save<T>(entity, data);
    }
    catch(err) {
        const error = err as Error;
        return [undefined, error];
    }
};

export async function save<T extends BaseEntity>(entity: Target<T>, data: Data<T>): Promise<OperationReturn<T>> {

    try {
        const repository = AppDataSource.getRepository(entity);
        const entityObject = repository.create(data);
        const res = await entityObject.save();
        return [res, undefined];
    }
    catch(err) {
        const error = err as QueryFailedError;
        return [undefined, error];
    }
};

export async function update<T extends BaseEntity>(entity: Target<T>, data: Data<T>): OperationReturn<T> {
    return await save<T>(entity, data);
};

/* Error Handling */
export function isQueryFailedError(err: Error | QueryFailedError): boolean {
    if(err instanceof QueryFailedError) {
        return true;
    }

    return false;
}; 

export function isDuplicateKeyError(err: QueryFailedError): boolean {
    const error = err.driverError as DatabaseError;

    if(error.code === "23505") {
        return true;
    }

    return false;
};