import {JsonSerializable, SerializerImplementation} from "threads";

const serializer: SerializerImplementation = {
    serialize(input: any, defaultSerialize: (inp: any) => JsonSerializable): JsonSerializable {
        if (input?.hasOwnProperty('$serializable')) {
            return defaultSerialize(input.$serializable());
        }

        return defaultSerialize(input);
    },

    deserialize(message: JsonSerializable, defaultDeserialize: (msg: JsonSerializable) => any): any {
        return defaultDeserialize(message);
    }
}
export default serializer;
