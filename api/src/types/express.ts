import type { 
    Request as ExpressRequest, 
    Response as ExpressResponse, 
    NextFunction as ExpressNextFunction 
} from 'express';
import { AuthPayload } from './auth.js';

export interface LocalsPagination {
    page: number,
    limit: number,
    offset: number
};

export interface Locals {
    pagination: LocalsPagination, 
    auth: AuthPayload
};

export type AuthenticatedResponse = ExpressResponse<any, Pick<Locals, "auth">>;
export type PaginatedResponse = ExpressResponse<any, Pick<Locals, "pagination">>;
export type AuthenticatedPaginatedResponse = ExpressResponse<any, Locals>;

export type APResponse = AuthenticatedPaginatedResponse;

export type Request<T = any, D = any> = ExpressRequest<D, any, T>;
export type Response = ExpressResponse<any, Partial<Locals>>;
export type NextFunction = ExpressNextFunction;