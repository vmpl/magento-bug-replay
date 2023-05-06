
export interface RecordEvent {
    timestamp: number,
    type: number,
    data: Object,
}
export class SessionWorker {
    initInstance(instance: string): Promise<any>;
    post(event: RecordEvent): Promise<boolean>;
}
