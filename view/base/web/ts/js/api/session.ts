import {IPaginatorFilter, IPaginatorResponse} from "VMPL_BugReplay/js/api/paginator";
import {RecordSession} from "VMPL_BugReplay/js/bug-replay/session/model/record-session";

export enum EventType {
    DomContentLoaded = 0,
    Load = 1,
    FullSnapshot = 2,
    IncrementalSnapshot = 3,
    Meta = 4,
    Custom = 5,
    Plugin = 6
}

export interface IRecordEvent {
    timestamp: number,
    type: EventType,
    data: any,
    sessionId?: number
}

export interface IRecordSession {
    id?: number,
    readonly title: string;
    readonly timestamp: number;
    readonly href: string;
    readonly uploaded?: string;
}

export interface IErrorConsole {
    id?: number,
    readonly message: string;
    readonly digest: string;
}

export type EventPostResult = {errors: IErrorConsole[], sessionId: number};

export interface SessionWorker {
    initInstance(instance: string): Promise<void>;
    post(event: IRecordEvent): Promise<EventPostResult>;
    sessions(offset: number, limit: number, filter: IPaginatorFilter<IRecordSession>): Promise<IPaginatorResponse<RecordSession>>;
    events(sessions: IRecordSession[]): Promise<IPaginatorResponse<IRecordEvent>>;
    export(sessions: IRecordSession[]): Promise<number[]>;
    import(url: string): Promise<void>;
    delete(sessions: IRecordSession[]): Promise<void>;
}
