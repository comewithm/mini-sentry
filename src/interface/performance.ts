export interface IPerformanceInfo {
    pageLoadTime?: number;
    whiteScreenTime?: number;
    directTime?: number;
    appCacheTime?: number;
    dnsTime?: number;
    tcpTime?: number;
    requestTime?: number;
    firstScreenTime?:number;
    domReadyTime?:number;
    beforeDomLoadTime?: number;
}

export interface IPVUVInfo {
    PV:number;
    UV:number;
}