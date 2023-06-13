export default function (objects: { copy: Function }) {
    const originalCopy = objects.copy.bind(objects);
    objects.copy = function (data: any) {
        switch (true) {
            case data.constructor.name === '_class':
                return data;
            default:
                return originalCopy(data);
        }
    }

    return objects;
}
