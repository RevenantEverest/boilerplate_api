export type PaginationUrl = string | null;
export interface PaginatedResults<T> {
    count: number,
    next: PaginationUrl,
    previous: PaginationUrl,
    results: T[]
};