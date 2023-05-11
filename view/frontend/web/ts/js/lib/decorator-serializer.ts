const deserialize: Map<string, Function> = new Map();
export { deserialize };

function randomstring(length: number = 64): string {
    let outString: string = '';
    let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
    }

    return outString;
}

export function serialize(): Function {
    return function (target: Object) {
        if (!target.hasOwnProperty('$serializeProperties')) {
            Object.defineProperty(target, '$serializeProperties', {
                value: [],
                configurable: false,
                writable: false,
                enumerable: true,
            })
        }
        const { $serializeProperties} = <{ $serializeProperties: string[] }>target;

        const $deserializable = (function (data: { [property: string]: any }) {
            let deserializable = <{ [property: string]: any }>(new this());
            deserializable.$_serializeProperties.forEach((it: string) => {
                deserializable[it] = data[it];
                if (deserializable[it].hasOwnProperty('$serializable')) {
                    deserializable[it] = deserializable[it].$deserializable(deserializable[it]);
                }
            })
            return deserializable;
        }).bind(target);

        let deserializeToken: string;
        do {
            deserializeToken = randomstring()
        } while (deserialize.has(deserializeToken));
        deserialize.set(deserializeToken, $deserializable);

        if (!target.hasOwnProperty('$serializable')) {
            Object.defineProperty(target, '$serializable', {
                writable: false,
                enumerable: false,
                configurable: false,
                value(): Object {
                    const self = <{ [property: string]: any }>this;
                    const serializable: { [property: string]: any } = {};
                    serializable['$serializableClass'] = deserializeToken;
                    $serializeProperties.forEach(it => {
                        serializable[it] = self[it];
                        if (serializable[it].hasOwnProperty('$serializable')) {
                            serializable[it] = serializable[it].$serializable();
                        }
                    })
                    return serializable;
                }
            });
        }
    }
}

export function serializable(): Function {
    return function (target: Object, propertyKey: string) {
        if (!target.hasOwnProperty('$serializeProperties')) {
            Object.defineProperty(target, '$serializeProperties', {
                value: [],
                configurable: false,
                writable: false,
                enumerable: true,
            })
        }

        const serializableClass = <{ $serializeProperties: string[] }>target;
        serializableClass.$serializeProperties.push(propertyKey);
    }
}
