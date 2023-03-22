
export interface IEventHint {
    event_id?: string;
    data?: any;
    syntheticException?: Error | null;
    originalException?: unknown;
}