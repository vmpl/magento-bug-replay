import {PaginatorFilter} from "VMPL_BugReplay/js/lib/items-paginator";

export declare type PaginatorItems = Array<Object>;

export interface IPaginatorLoader {
    loadPaginatorItems: (offset: number, limit: number, filter: IPaginatorFilter) => Promise<IPaginatorResponse>;
}

export interface IPaginatorResponse {
    items: PaginatorItems,
    meta: {
        totalRecords: number,
    }
}

export interface ICompare {
    match(item: any, against: any): boolean;
}

export interface IPaginatorFilter {
    and: boolean;
    property: PropertyKey;
    compare: ICompare;
    value: any;

    append(...filters: [PaginatorFilter]): PaginatorFilter;
    match(items: PaginatorItems): PaginatorItems;
}
