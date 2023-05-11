import {IMessageWorker, IWebWorker} from "VMPL_BugReplay/js/lib/worker/api";

export function WorkerConsumer(namespace: string = null) {
    if (!WorkerGlobalScope) {
        throw new Error(`Can only register on worker.`)
    }

    return function <T extends IWebWorker>(target: T) {
        return class extends target {
            constructor(...args: any[]) {
                super(args);
                this.run();
            }

            $$messageHandler(event: MessageEvent<IMessageWorker>) {
                if (!target.prototype.hasOwnProperty(event.data.method)) {
                    return;
                }

                Promise.all(event.data.arguments.map(this.$$requireClassModule.bind(this)))
                    .then((args: any[]) => {
                        return target.prototype[event.data.method].apply(this, args);
                    })
                    .then(result => postMessage(result))
                    .catch(error => {
                        console.error(error);
                        throw error;
                    })
            }

            run(): void {
                addEventListener('message', this.$$messageHandler.bind(this));

                const methods = Object.entries(Object.getOwnPropertyDescriptors(target.prototype))
                    .filter(([property, descriptor]) => {
                        return descriptor.value instanceof Function;
                    })
                    .map(([property]) => property);

                postMessage(<IMessageWorker>{
                    method: '$$init',
                    arguments: methods
                });
            }

            async $$requireClassModule(data: any): Promise<any> {
                switch (true) {
                    case data instanceof Array:
                        return data.map(this.$$requireClassModule.bind(this));
                    case data instanceof Object:
                        if (data.hasOwnProperty('$$classModule')) {
                            const [ModuleClass, LoadedClass] = data['$$classModule'].split(';');
                            data = await new Promise(resolve => {
                                require([ModuleClass], function (modules: any) {
                                    const module = new modules[LoadedClass]();
                                    resolve(Object.assign(module, data));
                                })
                            });
                            return this.$$requireClassModule(data);
                        }

                        return Promise.all(
                            Object.values(data).map(it => this.$$requireClassModule(it))
                        )
                            .then(values => {
                                return Object.fromEntries(Object.keys(data)
                                    .map((it, index) =>[it, values[index]] ))
                            })
                    default:
                        return data;
                }
            }
        }
    }
}
