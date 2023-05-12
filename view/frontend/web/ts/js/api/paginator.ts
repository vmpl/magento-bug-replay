import {PaginatorFilter} from "VMPL_BugReplay/js/lib/items-paginator";

export interface IPaginatorLoader<T extends Object> {
    loadPaginatorItems: (offset: number, limit: number, filter: IPaginatorFilter<T>) => Promise<IPaginatorResponse<T>>;
}

export interface IPaginatorResponse<T extends Object> {
    items: Array<T>,
    meta: {
        totalRecords: number,
    }
}

export interface ICompare {
    match(item: any, against: any): boolean;
}

export interface IPaginatorFilter<T extends Object> {
    and: boolean;
    property: PropertyKey;
    compare: ICompare;
    value: any;

    append(...filters: [PaginatorFilter<T>]): PaginatorFilter<T>;
    match(items: Array<T>): Array<T>;
}
