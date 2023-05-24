export declare type IWebWorker = {
    new(...args: any[]): {},
    [property: string]: any,
}

interface IMessageWorker extends Object {
    id: string,
    method: string,
}

export interface IMethodWorker extends IMessageWorker {
    arguments: Promise<any>[] | any[],
}

export interface IResultWorker extends IMessageWorker {
    result: Promise<any> | any;
}
