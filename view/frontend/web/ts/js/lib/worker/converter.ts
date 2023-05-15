export default class Converter {
    protected constructor() {
    }

    static classToObject(data: any): Promise<any> {
        switch (true) {
            case data instanceof Blob:
                return Promise.resolve(data);
            case data instanceof Array:
                return Promise.all(data.map(this.classToObject.bind(this)));
            case data instanceof Object:
                if (data['$$serialize'] instanceof Function) {
                    return Promise.resolve(data['$$serialize']());
                }

                return Promise.all(Object.values(data).map(this.classToObject.bind(this)))
                    .then(values => {
                        let convertedObject = Object.keys(data)
                            .map((key, index) => [key, values[index]])
                        return Object.fromEntries(convertedObject);
                    })
            default:
                return Promise.resolve(data);
        }
    }

    static objectToClass(data: any): Promise<any> {
        switch (true) {
            case data instanceof Blob:
                return Promise.resolve(data);
            case data instanceof Array:
                return Promise.all(data.map(this.objectToClass.bind(this)));
            case data instanceof Object:
                return Promise.all(Object.values(data).map(it => this.objectToClass(it)))
                    .then(values => {
                        let convertedObject = Object.keys(data)
                            .map((key, index) => [key, values[index]])
                        convertedObject = Object.fromEntries(convertedObject);

                        if (data.hasOwnProperty('$$classModule')) {
                            const [ModuleClass, RequiredClass] = data['$$classModule'].split(';');
                            return new Promise(resolve => {
                                require([ModuleClass], function (modules: any) {
                                    const loadedClass = modules[RequiredClass];
                                    if (loadedClass['$$deserialize'] instanceof Function) {
                                        resolve(loadedClass['$$deserialize'](convertedObject));
                                    } else {
                                        resolve(Object.assign(new loadedClass(), convertedObject));
                                    }
                                })
                            });
                        }

                        return convertedObject;
                    })
            default:
                return Promise.resolve(data);
        }
    }
}
