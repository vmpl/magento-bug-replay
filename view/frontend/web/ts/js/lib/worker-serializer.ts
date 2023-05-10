import {JsonSerializable, SerializerImplementation} from "threads";

export function serializable(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.__serializable = (target.__serializable ?? []);
        target.__serializable.push(propertyKey);
    }
}

const serializer: SerializerImplementation = {
    serialize(input: any, defaultSerialize: (inp: any) => JsonSerializable): JsonSerializable {
        if (!input.hasOwnProperty('__serializable')) {
            return defaultSerialize(input);
        }
    },

    deserialize(message: JsonSerializable, defaultDeserialize: (msg: JsonSerializable) => any): any {
        return defaultDeserialize(message);
    }
}
export default serializer;
