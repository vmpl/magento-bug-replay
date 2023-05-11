import {IMessageWorker} from "VMPL_BugReplay/js/lib/worker/api";

export function WorkerClient<T>(scriptUrl: string): Promise<T> {
    const worker = new Worker(scriptUrl);

    return new Promise(resolve => {
        worker.addEventListener('message', (event: MessageEvent<IMessageWorker>) => {
            const methods = event.data.arguments;
            resolve(Object.fromEntries(methods.map(method => {
                return [method, (...args: any[]) => {
                    const listener = new Promise(resolve => {
                        worker.addEventListener('message', (event) => {
                            resolve(event.data);
                        }, {once: true, passive: true});
                    })

                    Promise.all(args)
                        .then(resolved => worker.postMessage(<IMessageWorker>{
                            method,
                            arguments: resolved
                        }));

                    return listener;
                }];
            })))
        }, {once: true});
    });
}
