import {IMessageWorker, IWebWorker} from "VMPL_BugReplay/js/api/worker";
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

            $$messageHandler(event: MessageEvent<IMessageWorker>) {
                if (!target.prototype.hasOwnProperty(event.data.method)) {
                    return;
                }

                Promise.all(event.data.arguments.map(Converter.objectToClass.bind(Converter)))
                    .then((args: any[]) => {
                        return target.prototype[event.data.method].apply(this, args);
                    })
                    .then(result => Converter.classToObject(result))
                    .then(message => postMessage(message))
                    .catch(error => {
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
        }
    }
}
