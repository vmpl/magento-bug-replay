export default class Converter {
    protected constructor() {
    }

    static objectToClass(data: any): Promise<any> {
        switch (true) {
            case data instanceof Array:
                return Promise.all(data.map(this.objectToClass.bind(this)));
            case data instanceof Object:
                return Promise.all(Object.values(data).map(it => this.objectToClass(it)))
                    .then(values => {
                        let convertedObject = Object.keys(data)
                            .map((key, index) => [key, values[index]])
                        convertedObject = Object.fromEntries(convertedObject);

                        if (data.hasOwnProperty('$$classModule')) {
                            const [ModuleClass, LoadedClass] = data['$$classModule'].split(';');
                            return new Promise(resolve => {
                                require([ModuleClass], function (modules: any) {
                                    const module = new modules[LoadedClass]();
                                    resolve(Object.assign(module, convertedObject));
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
