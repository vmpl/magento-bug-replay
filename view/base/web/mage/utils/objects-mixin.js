define([], function () {
    'use strict';

    return function (objects) {
        const originalCopy = objects.copy.bind(objects);
        objects.copy = function (data) {
            if (Array.isArray(data)) {
                return originalCopy(data);
            }

            return Object.create(data);
        }

        return objects;
    };
});
