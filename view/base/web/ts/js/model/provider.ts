// @ts-ignore
import utils from 'mageUtils';
import _ from 'underscore';
import Component from 'uiComponent';
import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";

export default Component.extend({
    defaults: {
        fileHash: 'BugReplay',
        endpointRequest: '/vmpl-bug-report/worker/loader',
        ignoreTmpls: {
            data: true
        },
    },
    initialize(options: object) {
        this._super(options);
        const manager = this._manager();
        this._set('manager', () => manager);
        return this;
    },
    _manager() {
        return RecorderManager.init(this.endpointRequest, this.fileHash)
            .then(manager => {
                if (this.get('$recordEnable') === '1') {
                    manager.startRecord();
                }

                return manager;
            })
    },
    get(path: string) {
        if (path.startsWith('$')) {
            return this.storage().get(path.replace(/^\$/, ''));
        }

        return this._super(path);
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

        const data = this.get(path);
        let shouldDiff = !(data instanceof Function)
            && !this.isTracked(data);

        shouldDiff = shouldDiff && value.$$primary instanceof Function
            ? data?.$$primary() !== value.$$primary()
            : true;

        const diffs = shouldDiff
            ? utils.compare(data, value, path)
            : false;
        this._set(path ,value);

        if (diffs) {
            this._notifyChanges(diffs);
        }

        return this;
    },
    _set(path: string, value: any) {
        if (path.startsWith('$')) {
            return this.storage().set(path.replace(/^\$/, ''), value);
        }

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
})
