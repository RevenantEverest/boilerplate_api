import { Response, NextFunction } from './express.js';

export interface SendResponseOptions {
    res: Response,
    next?: NextFunction,
    err?: Error,
    status?: number,
    message?: string
};

export interface ErrorLogOptions {
    color: string | number,
    message?: string,
    err?: Error 
};

export interface HandleTupleOptions<T> {
    res: T | undefined,
    err: Error | undefined,
    errMsg: string
};

export interface SendEntitiesResponseParams<T> {
    res: Response,
    err?: Error,
    message: string,
    entityReturn?: T | null,
    missingEntityReturnMessage: string
};