// @ts-ignore
import utils from 'mageUtils';
import _ from 'underscore';
import Component from 'uiComponent';

export default Component.extend({
    defaults: {
        ignoreTmpls: {
            data: true
        }
    },
    set(path: string, value: any) {
        if (value instanceof Array) {
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
    }
})
