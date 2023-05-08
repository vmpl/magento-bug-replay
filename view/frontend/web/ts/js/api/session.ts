export enum EventType {
    DomContentLoaded = 0,
    Load = 1,
    FullSnapshot = 2,
    IncrementalSnapshot = 3,
    Meta = 4,
    Custom = 5,
    Plugin = 6
}

export interface RecordEvent {
    timestamp: number,
    type: EventType,
    data: any,
}

export interface RecordSession {
    timestamp: Date;
    href: URL;
    title: string;
}

export type SnapshotWithMeta = {snapshot: RecordEvent, meta: RecordEvent};

export interface SessionWorker {
    initInstance(instance: string): Promise<any>;
    post(event: RecordEvent): Promise<boolean>;
    sessions(offset: number, limit: number): Promise<any[]>
}
