import {
    ICompare, IPaginatorFilter,
    IPaginatorLoader,
    PaginatorItems
} from "VMPL_BugReplay/js/api/paginator";
import {serializable, serialize} from "VMPL_BugReplay/js/lib/decorator-serializer";

enum CompareTypes {
    equal,
    in,
    less,
    more,
    regex,
}

@serialize()
export class CompareType implements ICompare {
    @serializable() protected readonly type: CompareTypes;

    constructor(
        type: CompareTypes = CompareTypes.equal,
    ) {
        this.type = type;
    }

    match(item: any, against: any): boolean {
        switch (this.type) {
            case CompareTypes.equal:
                return item == against;
            case CompareTypes.in:
                return against.includes(item);
            case CompareTypes.less:
                return item < against;
            case CompareTypes.more:
                return item > against;
            case CompareTypes.regex:
                return (<RegExp>against).test(<string>item);
            default:
                throw new Error(`Case not implemented: ${this.type}`);
        }
    }
}

@serialize()
export class PaginatorFilter implements IPaginatorFilter {
    @serializable() public compare: ICompare;

    constructor(
        public and: boolean = true,
        public property: PropertyKey = null,
        compare: ICompare = new CompareType(CompareTypes.equal),
        public value: any = undefined,
        protected groups: PaginatorFilter[] = [],
    ) {
        this.compare = compare;
    }

    append(...filters: [PaginatorFilter]): PaginatorFilter {
        this.groups.push(...filters);
        return this;
    }

    match(items: PaginatorItems): PaginatorItems {
        return items.filter(this.matchItem.bind(this));
    }

    protected matchItem(item: Object): boolean {
        if (!item.hasOwnProperty(this.property)) {
            throw new Error(`item do not have property named: ${this.property.toString()}`)
        }

        const groupsMatched: Array<boolean> = this.groups.map(it => it.matchItem(item));
        groupsMatched.push(this.compare.match(this.getItemValue(item, this.property), this.value));

        return this.and
            ? !groupsMatched.includes(false)
            : groupsMatched.includes(true);
    }

    protected getItemValue(item: any, property: PropertyKey): any {
        const propertyComponents = (<string>property).split('.');
        const itemProperty = propertyComponents.shift();

        const itemValue = item.hasOwnProperty(itemProperty) ? item[itemProperty] : undefined;
        return propertyComponents.length === 0 ? itemValue : this.getItemValue(itemValue, propertyComponents.join('.'));
    }
}

export default class <Items extends PaginatorItems, Loader extends IPaginatorLoader> {
    protected readonly _filter: PaginatorFilter = new PaginatorFilter();
    protected _page: number = 1;
    protected _size: number = 20;

    protected totalRecords: number = undefined;

    set page(value: number) {
        if (!(this._page > 0)) {
            throw new Error('Page cannot be lower then 1.');
        }
        if (value > this.lastPage) {
            throw new Error('Page cannot be greater then lastPage.');
        }

        this._page = value;
    }

    set size(value: number) {
        if (value <= 0) {
            throw new Error('Size have to be greater then 0.');
        }
        if (this.totalRecords !== undefined && this.totalRecords > value) {
            throw new Error('Size is greater then records found');
        }

        this._size = value;
    }

    set filter(value: PaginatorFilter) {
        this.page = 1;
        this.items = <Items>[];
        this._filter.append(value);
    }

    get lastPage(): number {
        let lastPage = this.totalRecords / this._size;
        lastPage += this.totalRecords % this._size ? 1 : 0;
        return lastPage;
    }

    constructor(
        protected items: Items,
        protected readonly loader: Loader,
    ) {
    }

    getCurrentPage(): Promise<Items> {
        const offset = (this._page - 1) * this._size;
        const limit = this._size;

        if (offset >= this.items.length) {
            const leftChunk = <Items>this.items.slice(0, offset);
            const rightChunk: Items = <Items>this.items.slice(offset + limit);
            return this.loader.loadPaginatorItems(offset, limit, this._filter).then(response => {
                this.totalRecords = response.meta.totalRecords;
                this.items = <Items>[].concat(leftChunk, response.items, rightChunk);
                return <Items>response.items;
            })
        }

        return Promise.resolve(<Items>this.items.slice(offset, limit));
    }
}
