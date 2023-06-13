// @ts-ignore
import utils from 'mageUtils';

declare type IPrimary = {
    new (...args: any[]): object;
}

export default function (path: string) {
    return function <T extends IPrimary>(target: T) {
        return class extends target {
            $$primary(): any {
                return utils.nested(this, path) ?? this;
            }
        }
    }
}
