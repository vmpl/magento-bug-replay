import {RecordSession} from "VMPL_BugReplay/js/api/session";

export default class {
    protected page: number = 1;
    protected size: number = 20;
    protected items: RecordSession[] = [];

    constructor(
        protected readonly loadingItems: (offset: number, limit: number) => Promise<RecordSession[]>,
    ) {
    }


    getCurrentPage(): Promise<RecordSession[]> {
        const offset = (this.page - 1) * this.size;
        const limit = this.size;

        if (offset >= this.items.length) {
            const leftChunk = this.items.slice(0, offset);
            const rightChunk = this.items.slice(offset + limit);
            return this.loadingItems(offset, limit).then(items => {
                this.items = [].concat(leftChunk, items, rightChunk);
                return items;
            })
        }

        return Promise.resolve(this.items.slice(offset, limit));
    }

    goPage(page: number) {
        if (!(page > 0)) {
            throw new Error('Page cannot be lower then 1.');
        }

        this.page = page;
    }

    goNext() {
        this.goPage(this.page + 1);
    }

    goPrevious() {
        if (this.page !== 1) {
            this.goPage(this.page - 1);
        }
    }
}
