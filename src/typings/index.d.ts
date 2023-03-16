
type Collect = {
    exception?: Exception | PromiseError;
    performance?: PerformanceInfo;
    pageView?: PageView;
    history?: HistoryInfo;
    fetch?: FetchInfo.FetchReq;
    xhr?: XHRInfo
}

type currentType<F extends keyof T, T> = T[F]


interface Exception {
    message: string;
    source: string;
    lineno: number;
    colno: number;
    error: Error | null;
}

interface PromiseError {
    reason: any
}



interface PageView {
    PV?: number;
    UV?: number;
    leaveTime?: number;
}


interface HistoryInfo {
    from: string;
    to: string;
    params?: any;
}



declare namespace FetchInfo {

    interface FetchReq {
        params?: any;
        method?: string;
        url?: string;
        startTimestamp?: number;
        response?:any
        endTimestamp?: number;
        error?:Error | null
    }
}


interface XHRInfo {
    method: string;
    url: string;
    status?: string;
    error?:Error | null;
    args?: any;
    startTimestamp?:number;
    endTimestamp?:number;
    xhr?:any;
}