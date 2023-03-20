import { WINDOW } from "utils/helper";


export function getPerformance() {
    const {timing} = performance
    const {
        navigationStart,
        redirectStart, 
        redirectEnd,
        fetchStart,
        domainLookupStart,
        domainLookupEnd,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        loadEventStart,
    } = timing;

    const pageLoadTime = loadEventStart - navigationStart
    const whiteScreenTime = responseStart - navigationStart;
    const redirectTime = redirectEnd - redirectStart;
    const appCacheTime = domainLookupStart - fetchStart
    const dnsTime = domainLookupEnd - domainLookupStart;
    const tcpTime = connectEnd - connectStart
    const requestTime = responseEnd - requestStart;

    const performanceInfo: IPerformanceInfo = {
        pageLoadTime,
        whiteScreenTime,
        directTime: redirectTime,
        appCacheTime,
        dnsTime,
        tcpTime,
        requestTime
    }

    return performanceInfo
}


export function getPerformanceEntries() {
    const performance = WINDOW.performance.getEntries()

    const info = performance[0] as PerformanceNavigationTiming

    const {
        unloadEventStart,
        unloadEventEnd,
        redirectStart,
        redirectEnd,
        fetchStart,
        domainLookupStart,
        domainLookupEnd,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        domComplete,
        loadEventStart,
        loadEventEnd
    } = info

    const pageLoadTime = loadEventStart
    const whiteScreenTime = responseStart;
    const redirectTime = redirectEnd - redirectStart;
    const appCacheTime = domainLookupStart - fetchStart
    const dnsTime = domainLookupEnd - domainLookupStart;
    const tcpTime = connectEnd - connectStart
    const requestTime = responseEnd - requestStart;

    const performanceInfo: IPerformanceInfo = {
        pageLoadTime,
        whiteScreenTime,
        directTime: redirectTime,
        appCacheTime,
        dnsTime,
        tcpTime,
        requestTime
    }

    console.log("performance entries:", info)
    
    return performanceInfo
}