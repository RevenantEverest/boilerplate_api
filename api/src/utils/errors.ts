import { QueryFailedError } from 'typeorm';

import type { 
    SendResponseOptions, 
    ErrorLogOptions, 
    HandleTupleOptions,
    SendEntitiesResponseParams 
} from '@@types/errors.js';
import type { Response } from '@@types/express.js';

import * as logs from './logs.js';
import * as colors from './colors.js';
import * as entities from './entities.js';

export function sendResponse({ res, next, err, status=500, message }: SendResponseOptions): void {
    const logOptions: ErrorLogOptions = {
        color: colors.error
    };

    if(err) {
        logOptions.err = err;
    }

    if(message) {
        logOptions.message = message;
    }

    if(err && message) {
        logs.error(logOptions);
    }

    if(next && err) {
        next(err);
    }
    else {
        res.status(status).json({ error: true, message });
    }
};

export function handleTuple<T>({res, err, errMsg}: HandleTupleOptions<T>): Error | undefined {    
    if(err) {
        return err;
    }
    else if(!res) {
        return new Error(errMsg);
    }
 
    return undefined;
};

export function sendEntitiesResponse<T>({ res, err, message, entityReturn, missingEntityReturnMessage }: SendEntitiesResponseParams<T>) {
    if(err) {
        const isQueryFailedError = entities.isQueryFailedError(err);
        const isDuplicateKeyError = isQueryFailedError && entities.isDuplicateKeyError(err as QueryFailedError);

        if(isDuplicateKeyError) {
            return sendResponse({ res, status: 400, message });
        }
        return sendResponse({ res, err, status: 500, message: message ?? err.message });
    }

    if(!entityReturn) {
        return sendResponse({ res, status: 404, message: missingEntityReturnMessage });
    }
};

export function sendInvalidBody(res: Response) {
    return sendResponse({ res, status: 400, message: "Invalid Body" });
};