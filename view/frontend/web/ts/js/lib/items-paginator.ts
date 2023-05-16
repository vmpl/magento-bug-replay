import {
    ICompare, IPaginatorFilter,
    IPaginatorLoader,
} from "VMPL_BugReplay/js/api/paginator";
import * as module from "module";
import {WorkerArgument} from "VMPL_BugReplay/js/lib/worker/decorator";
import {of} from "rxjs";

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

export default class<T extends Object, L extends IPaginatorLoader<T>> implements AsyncIterable<T> {
    protected readonly _filter: PaginatorFilter<T> = new PaginatorFilter();
    protected _page: number = 1;
    protected _size: number = 5;

    set page(value: number) {
        if (!(this._page > 0)) {
            throw new Error('Page cannot be lower then 1.');
        }

        this._page = value;
    }

    set size(value: number) {
        if (value <= 0) {
            throw new Error('Size have to be greater then 0.');
        }
        if (this.items.length && this.items.length > value) {
            throw new Error('Size is greater then records found');
        }

        this._size = value;
    }

    set filter(value: PaginatorFilter<T>) {
        this.page = 1;
        this.items = [];
        this._filter.append(value);
    }

    constructor(
        protected items: Array<T>,
        protected readonly loader: L,
    ) {
    }

    protected loadPage(): Promise<void> {
        const offset = (this._page - 1) * this._size;
        const limit = this._size;

        if (!this.items.length || this.items.slice(offset, offset + limit).includes(undefined)) {
            return this.loader.loadPaginatorItems(offset, limit, this._filter)
                .then(response => {
                    this.items.length
                        || (this.items = new Array(response.meta.totalRecords));

                    response.items.forEach((item, index) => {
                        this.items[offset + index] = item;
                    })
                })
        }

        return Promise.resolve();
    }

    fetch(atIndex: number): Promise<T> {
        this.page = (atIndex / this._size) + 1;
        return this.loadPage()
            .then(() => this.items[atIndex]);
    }

    clear() {
        this._page = 1;
        this.items = [];
    }

    [Symbol.asyncIterator](): AsyncIterator<T> {
        let counter: number = 0;
        return {
            next: (): Promise<IteratorResult<T>> => {
                return this.fetch(++counter)
                    .then(item => {
                        return {value: item, done: counter == this.items.length}
                    });
            }
        }
    }
}
