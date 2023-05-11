declare type ObjectClass = { [property: string]: any }
const deserialize: Map<string, {$$deserialize: Function}> = new Map();
export {deserialize};

function randomstring(length: number = 64): string {
    let outString: string = '';
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }

    return outString;
}

export function injectableArgument(module: string) {
    return function <T extends { new(...args: any[]): {} }>(target: T) {
        return class extends target {
            $$classModule: string = `${module};${target.name}`;
        };
    }
}

export function exportToObject(target: ObjectClass, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    if (!target.hasOwnProperty('$exportMethods')) {
        Object.defineProperty(target, '$exportMethods', {
            value: [],
            configurable: false,
            enumerable: true,
            writable: false
        });
    }

    if (!target.hasOwnProperty('$exportObject')) {
        Object.defineProperty(target, '$exportObject', {
            value: function (): Object {
                const exportObject: ObjectClass = {};
                (target['$exportMethods']).forEach((method: string) => {
                    exportObject[method] = target[method].bind(target);
                })
                return exportObject;
            },
            configurable: false,
            enumerable: false,
            writable: false
        })
    }

    (<string[]>target['$exportMethods']).push(propertyName);
    const parentMethod = descriptor.value!;
    descriptor.value = function (...args: any[]) {
        return parentMethod.apply(this, args.map(argument => {
            if (argument.hasOwnProperty('$$classModule')) {
                console.log('$$classModule');
            }
            return argument;
        }));
    }
}
