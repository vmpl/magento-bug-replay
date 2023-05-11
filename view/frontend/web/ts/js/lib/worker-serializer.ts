import {JsonSerializable, SerializerImplementation} from "threads";

const serializer: SerializerImplementation = {
    serialize(input: any, defaultSerialize: (inp: any) => JsonSerializable): JsonSerializable {
        return defaultSerialize(input);
    },

    deserialize(message: JsonSerializable, defaultDeserialize: (msg: JsonSerializable) => any): any {
        if (message.hasOwnProperty('$$classModule')) {
            console.log(message['$$classModule']);
            const [ScriptUrl, ModuleClass, DeserializeClass] = message['$$classModule'].split(';')
            const moduleDefinition = require.async([ModuleClass]);
            console.log(moduleDefinition)
        }
        return defaultDeserialize(message);
    }
}
export default serializer;
