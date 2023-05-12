export function WorkerArgument(module: string) {
    return function <T extends { new(...args: any[]): {} }>(target: T) {
        return class extends target {
            $$classModule: string = `${module};${target.name}`;
        };
    }
}

export function WorkerSerializable(serializer: { [property: string]: [Function, Function] }) {
    return function <T extends { new(...args: any[]): {} }>(target: T) {
        return class extends target {
            $$serialize(): Object {
                return Object.fromEntries(Object.entries(this)
                    .map(([property, value]) => {
                        if (value instanceof Function) {
                            return null;
                        }

                        if (!serializer.hasOwnProperty(property)) {
                            return [property, value];
                        }

                        const [serialize] = serializer[property];
                        return [property, serialize(value)];
                    }).filter(it => it !== null))
            }

            static $$deserialize(data: Object) {
                const deserializeObject: Object = Object.fromEntries(Object.entries(data)
                    .map(([property, value]) => {
                        if (!serializer.hasOwnProperty(property)) {
                            return [property, value];
                        }

                        const [serialize, deserialize] = serializer[property];
                        return [property, deserialize(value)];
                    }));

                return Object.assign((new this), deserializeObject);
            }
        };
    }
}
