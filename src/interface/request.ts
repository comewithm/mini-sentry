

export interface IFetchData {
    args: any[];
    data: {
        method: string;
        url: string;
    };
    startTimestamp: number;
    response?: any 
}

export interface IHistoryData {
    from: string;
    to:string;
    leaveTimestamp: number;
    params?: any
}

export interface IXHRInfo {
    method: string;
    url: string;
    body?: any
    status?: number;
}
export interface IXHRData {
    args: IXHRInfo,
    startTimestamp?: number;
    endTimestamp?: number;
    xhr?: any;
}

export interface IErrorData {

}

