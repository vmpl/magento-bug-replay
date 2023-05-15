import {
    ICompare, IPaginatorFilter,
    IPaginatorLoader,
} from "VMPL_BugReplay/js/api/paginator";
import * as module from "module";
import {WorkerArgument} from "VMPL_BugReplay/js/lib/worker/decorator";

enum CompareTypes {
    equal,
    in,
    less,
    more,
    regex,
}

@WorkerArgument(module.id)
export class CompareType implements ICompare {
    constructor(
        protected readonly type: CompareTypes = CompareTypes.equal,
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

@WorkerArgument(module.id)
export class PaginatorFilter<T extends Object> implements IPaginatorFilter<T> {
    constructor(
        public property: PropertyKey = null,
        public value: any = undefined,
        public compare: ICompare = new CompareType(CompareTypes.equal),
        public and: boolean = true,
        protected groups: PaginatorFilter<T>[] = [],
    ) {
    }

    append(...filters: PaginatorFilter<T>[]): PaginatorFilter<T> {
        this.groups.push(...filters);
        return this;
    }

    match(items: Array<T>): Array<T> {
        return items.filter(this.matchItem.bind(this));
    }

    protected matchItem(item: Object): boolean {
        const groupsMatched: Array<boolean> = this.groups.map(it => it.matchItem(item));
        if (this.property) {
            if (!item.hasOwnProperty(this.property)) {
                throw new Error(`item do not have property named: ${this.property.toString()}`)
            }
            groupsMatched.push(this.compare.match(this.getItemValue(item, this.property), this.value));
        }

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

export default class <T extends Object, L extends IPaginatorLoader<T>> {
    protected readonly _filter: PaginatorFilter<T> = new PaginatorFilter();
    protected _page: number = 1;
    protected _size: number = 5;

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

    set filter(value: PaginatorFilter<T>) {
        this.page = 1;
        this.items = [];
        this._filter.append(value);
    }

    get lastPage(): number {
        let lastPage = this.totalRecords / this._size;
        lastPage += this.totalRecords % this._size ? 1 : 0;
        return lastPage;
    }

    constructor(
        protected items: Array<T>,
        protected readonly loader: L,
    ) {
    }

    getCurrentPage(): Promise<Array<T>> {
        const offset = (this._page - 1) * this._size;
        const limit = this._size;

        if (offset >= this.items.length) {
            const leftChunk = <Array<T>>this.items.slice(0, offset);
            const rightChunk = <Array<T>>this.items.slice(offset + limit);
            return this.loader.loadPaginatorItems(offset, limit, this._filter).then(response => {
                this.totalRecords = response.meta.totalRecords;
                this.items = <Array<T>>[].concat(leftChunk, response.items, rightChunk);
                return <Array<T>>response.items;
            })
        }

        return Promise.resolve(<Array<T>>this.items.slice(offset, offset + limit));
    }

    fetch(index: number): Promise<T> {
        return this.loader.loadPaginatorItems(index, 1, this._filter)
            .then(result => result.items.shift());
    }
}
