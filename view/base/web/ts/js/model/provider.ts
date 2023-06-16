// @ts-ignore
import utils from 'mageUtils';
import _ from 'underscore';
import Component from 'uiComponent';
import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";
import {PaginatorFilter} from "VMPL_BugReplay/js/lib/items-paginator";

export default Component.extend({
    defaults: {
        fileHash: 'BugReplay',
        ignoreTmpls: {
            data: true
        },
        modules: {
            player: 'player',
        },
    },
    initialize(options: object) {
        this._super(options);

        const manager = this._manager()
            .then((manager: RecorderManager) => {
                if (!this.player()) {
                    manager.startRecord();
                }
                this.exposeDemoActions(manager);

                return manager;
            })
        this._set('manager', () => manager)

        return this;
    },
    _manager() {
        return RecorderManager.init('/vmpl-bug-report/worker/loader', this.fileHash);
    },
    set(path: string, value: any) {
        if (value instanceof Array) {
            Object.keys(this.get(path) ?? {})
                .filter(index => ~~index >= value.length)
                .forEach(index => this.remove(`${path}.${index}`));

            for (let index in value) {
                this.set(`${path}.${index}`, value[index]);
            }

            return this;
        }

        // @docs prevents the loop of the same item
        if (!(value.$$primary instanceof Function)) {
            return this._super(path, value);
        }

        const data = this.get(path);
        const diffs = !(data instanceof Function)
            && !this.isTracked(data)
            && data?.$$primary() !== value.$$primary()
                ? utils.compare(data, value, path)
                : false;
        this._set(path ,value);

        if (diffs) {
            this._notifyChanges(diffs);
        }

        return this;
    },
    _set(path: string, value: any) {
        let pathComponent, parent = this;
        const pathComponents = path.split('.');
        const lastPathComponent = pathComponents.pop();
        while(pathComponent = pathComponents.shift()) {
            if (!_.isObject(parent[pathComponent])) {
                parent[pathComponent] = {};
            }
            parent = parent[pathComponent];
        }
        if (_.isFunction(parent[lastPathComponent])) {
            parent[lastPathComponent](value);
        } else {
            parent[lastPathComponent] = value;
        }
    },
    exposeDemoActions(manager: RecorderManager) {
        const range = (from: number, to: number) => {
            const range = [];
            for (let i = from; i < to; i++) {
                range.push(i);
            }
            return range;
        }

        // @ts-ignore
        window.demo = {
            startRecord: () => {
                manager.startRecord()
            },
            getSessionRecords: () => {
                manager.paginator.forEach((item) => {
                    console.log(item)
                });
            },
            goForPage: (value: number) => (manager.paginator.page = value),
            addFilterWithTitle: (title: string = 'Jackets - Tops - Women') => {
                manager.paginator.filter = new PaginatorFilter('title', title);
            },
            getTwoFirstSessionEvents: (from: number = 0, to: number = 2) => {
                Promise.all(range(from, to).map(it => manager.paginator.fetch(it)))
                    .then(sessions => manager.getEventsForSessionAt(sessions))
                    .then(events => console.log(events))
            },
            uploadSessions: () => {
                manager.paginator.all()
                    .then(sessions => {
                        return manager.uploadSessions(sessions);
                    })
                    .then(() => console.log('finished'));
            },
            deleteFirstSession: () => {
                manager.deleteAt(0)
                    .then(() => console.log('deleted'));
            },
            deleteAllSessions: () => {
                manager.paginator.forEach((item, index) => {
                    manager.deleteAt(index);
                })
                    .then(() => console.log('deletedAll'))
            }
        }
    }
})
