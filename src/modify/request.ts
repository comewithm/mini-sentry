import { triggerHandlers } from "trigger"
import { fill, getFetchMethod, getFetchUrl } from "utils"


let originFetch = window.fetch

// fetch(input:string, init?:object)
export function instrumentFetch() {
    fill(window, "fetch", function(originalFetch) {
        let args = [].slice.call(arguments)
        
        const method = getFetchMethod(args)
        const url = getFetchUrl(args)
        
        const fetchData:FetchInfo.FetchReq = {
            params: args,
            method,
            url,
            startTimestamp: Date.now()
        }
        
        triggerHandlers("fetch", fetchData)
        
        return originFetch.apply(window, args as any)
            .then(res => {
                const fetchData:FetchInfo.FetchReq = {
                    endTimestamp: Date.now(),
                    response:res
                }
                triggerHandlers("fetch", fetchData)
                return res
            }, err => {
                const fetchData:FetchInfo.FetchReq = {
                    endTimestamp: Date.now(),
                    error: err
                }
                triggerHandlers("fetch", fetchData)
                throw err
            })
    })
}

// xhrReq.open(method, url, async);
// XMLHttpRequest.send(body)
export function instrumentXHR() {
    const xhrProto = XMLHttpRequest.prototype

    fill(xhrProto, "open", function(originalOpenFunction) {
        return function (this, ...args:any[]) {
            const xhr = this

            const url = args[1]

            const xhrInfo:XHRInfo = {
                method: String(args[0]).toUpperCase(),
                url
            }

            fill(xhr, "onreadystatechange", function(originalReadyState: Function) {
                return function(...readyStateArgs:any[]) {
                    if(xhr.readyState === 4) {
                        xhrInfo.status = xhr.status
                    }

                    triggerHandlers("xhr", {
                        args,
                        xhr,
                        startTimestamp: Date.now(),
                        endTimestamp: Date.now()
                    })

                    return originalReadyState.apply(xhr, readyStateArgs)
                }
            })

            originalOpenFunction.apply(xhr, args)
        }
    })

    fill(xhrProto, "send", function(originalSend){
        return function(this, ...args) {

            triggerHandlers("xhr", {
                args,
                startTimestamp: Date.now(),
                xhr:this
            })

            return originalSend.apply(this, args)
        }
    })
}