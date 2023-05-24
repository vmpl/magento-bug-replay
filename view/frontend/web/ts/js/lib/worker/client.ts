import {IMethodWorker, IResultWorker} from "VMPL_BugReplay/js/api/worker";
import Converter from "VMPL_BugReplay/js/lib/worker/converter";
import {v4 as uuid} from 'uuid';

class ClientEvent extends Event {
    constructor(
        type: string,
        public readonly data: any,
        eventInitDict?: EventInit,
    ) {
        super(type, eventInitDict);
    }
}

class Client {
    protected constructor(
        public readonly worker: Worker,
        protected readonly dispatcher = new EventTarget(),
    ) {
        this.worker.addEventListener('message', this.onMessage.bind(this));
    }

    static init(worker: Worker): Promise<Object> {
        const instance = new Client(worker);
        return new Promise(resolve => {
            instance.dispatcher.addEventListener('$$init', (event: ClientEvent) => {
                const entries = (<string[]>event.data)
                    .map(method => {
                        return [method, (...args: any[]) => (instance.postMessage(method, args))];
                    })

                resolve(Object.fromEntries(entries))
            }, {once: true});
        })
    }

    protected onMessage(event: MessageEvent<IResultWorker>) {
        Converter.objectToClass(event.data.result)
            .then(result => new ClientEvent(event.data.id, result))
            .then(event => this.dispatcher.dispatchEvent(event))
    }

    protected postMessage(method: string, args: any[]): Promise<any> {
        const id = uuid();
        Promise.all(args.map(Converter.classToObject.bind(Converter)))
            .then(resolved => this.worker.postMessage(<IMethodWorker>{
                id,
                method,
                arguments: resolved,
            }));

        return new Promise(resolve => {
            this.dispatcher.addEventListener(id, (event: ClientEvent) => {
                resolve(event.data);
            }, {once: true});
        });
    }
}

export function WorkerClient<T extends Object>(scriptUrl: string): Promise<T> {
    return Client.init(new Worker(scriptUrl))
        .then((client: T) => client);
}
