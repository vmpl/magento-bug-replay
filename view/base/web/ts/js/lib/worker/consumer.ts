import {IMethodWorker, IResultWorker, IWebWorker} from "VMPL_BugReplay/js/api/worker";
import Converter from "VMPL_BugReplay/js/lib/worker/converter";

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

            $$messageHandler(event: MessageEvent<IMethodWorker>) {
                if (!target.prototype.hasOwnProperty(event.data.method)) {
                    return;
                }

                Promise.all(event.data.arguments.map(Converter.objectToClass.bind(Converter)))
                    .then((args: any[]) => {
                        return target.prototype[event.data.method].apply(this, args);
                    })
                    .then(result => Converter.classToObject(result))
                    .then(data => postMessage(<IResultWorker>{
                        id: event.data.id,
                        method: event.data.method,
                        result: data
                    }))
                    .catch(error => {
                        throw error;
                    })
            }

            run(): void {
                const methods = Object.entries(Object.getOwnPropertyDescriptors(target.prototype))
                    .filter(([property, descriptor]) => {
                        return descriptor.value instanceof Function;
                    })
                    .map(([property]) => property);

                postMessage(<IResultWorker>{
                    id: '$$init',
                    method: '$$init',
                    result: methods
                });

                addEventListener('message', this.$$messageHandler.bind(this));
            }
        }
    }
}
