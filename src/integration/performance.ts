

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

    const performanceInfo: PerformanceInfo = {
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