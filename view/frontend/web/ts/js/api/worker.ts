export declare type IWebWorker = {
    new(...args: any[]): {},
    [property: string]: any,
}

export interface IMessageWorker extends Object {
    method: string,
    arguments: Promise<any>[] | any[],
}
