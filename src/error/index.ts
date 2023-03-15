

import {collections, triggerHandlers} from '../trigger'

// onerror

export function instrumentErrors() {
    let oldError = window["onerror"]
    let unhandledRejection = window['onunhandledrejection']

    window['onerror'] = function(message, source, lineno, colno, error) {
        let args:any[] = [].slice.call(arguments)
    
        triggerHandlers('exception', {
            message,
            source,
            lineno,
            colno,
            error
        })
        
        if(oldError) {
            oldError.apply(window, args as any)
        }
        console.log("collections on window error:", collections)
    }

    // promise error
    window['onunhandledrejection'] = function(event) {
    
        triggerHandlers("exception", {
            reason: event.reason || event.detail.reason
        })
    
        if(unhandledRejection) {
            unhandledRejection.apply(window, event)
        }
        console.log("collections on promise error:", collections)
    }
}




let pageViews = localStorage.getItem("PV") || 0
let lastTime = 0
let now = 0
// onload
window.addEventListener("load", function() {
    
    lastTime = now = Date.now()
    // 页面性能
    getPerformance()

    // 刷新次数
    getPageView()

})

function getPerformance() {
    // let pnt = new PerformanceNavigationTiming()
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
    // const navigationStart = performance.timeOrigin

    const pageLoadTime = loadEventStart - navigationStart
    const whiteScreenTime = responseStart - navigationStart;
    const redirectTime = redirectEnd - redirectStart;
    const appCacheTime = domainLookupStart - fetchStart
    const dnsTime = domainLookupEnd - domainLookupStart;
    const tcptime = connectEnd - connectStart
    const requtime = responseEnd - requestStart;

    // 页面性能
    triggerHandlers("performance", {
        pageLoadTime,
        whiteScreenTime,
        redirectTime,
        appCacheTime,
        dnsTime,
        tcpTime:tcptime,
        requestTime:requtime
    })
}

function getPageView() {
    pageViews = +pageViews + 1
    triggerHandlers("pageView", {
        "PV": pageViews,
        "UV": 1
    })
    localStorage.setItem("PV", JSON.stringify(pageViews))
}


window.addEventListener("unload", function() {
    now = Date.now();
    console.log("unload")
    triggerHandlers("pageView", {
        leaveTime: now - lastTime
    })
    lastTime = now = 0
})