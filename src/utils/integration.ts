import { SHOULD_LOG } from "cons";
import { THandleCallback, THandleType } from "interface";
import { IFetchData, IXHRData, IXHRInfo } from "interface/request";
import { fill, getFetchMethod, getFetchUrl } from "utils";
import { CONSOLE_LEVELS } from "./console";
import { WINDOW } from "./helper";

const handlers: {
    [key in THandleType]?: THandleCallback[]
} = {}

const isCollect: {
    [key in THandleType]?: boolean
} = {}

// 改写方法
export function pushHandlers(type: THandleType, callback: THandleCallback) {
    handlers[type] = handlers[type] || [];
    (handlers[type] as THandleCallback[]).push(callback)

    collectType(type)
}

// 执行回调
export function triggerHandlers(type: THandleType, data: any) {

    if(!handlers[type]) {
        return
    }

    for (const handle of handlers[type] || []) {
        // 即是执行pushHandlers(type, callback)中的callback回调
        handle(data)
    }
}


function collectType(type: THandleType) {
    if(isCollect[type]) return

    isCollect[type] = false

    switch(type) {
        case "error":
            handleError()
            break;
        case "fetch":
            handleFetch()
            break;
        case "history":
            handleHistory()
            break;
        case "xhr":
            handleXHR()
            break
        case "unhandledrejection":
            handlerUnhandledrejection()
            break
        case "console":
            handleConsole()
            break;
        default:
            return;
    }
}

function handleError(){
    const originalError = WINDOW.onerror

    SHOULD_LOG && console.log("trigger error")

    WINDOW.onerror = function(
        message: any,
        url: any,
        line:any,
        col: any,
        error: any
    ): boolean {
        triggerHandlers("error", {
            message,
            url,
            line,
            col,
            error
        })

        if(originalError) {
            return originalError.apply(this, arguments)
        }
        return false
    }
}

function handlerUnhandledrejection(){
    const originalRejection = WINDOW.onunhandledrejection
    WINDOW.onunhandledrejection = function(e) {
        triggerHandlers("unhandledrejection", e)

        if(originalRejection) {
            return originalRejection.apply(this, arguments)
        }

        return true
    }
}

function handleFetch(){
    SHOULD_LOG && console.log("init fetch")

    fill(WINDOW, "fetch", function(originalFetch) {
        return function(...args:any[]) {
            const handleData:IFetchData = {
                args,
                data: {
                    method: getFetchMethod(args),
                    url: getFetchUrl(args)
                },
                startTimestamp: Date.now()
            }

            triggerHandlers("fetch", {
                ...handleData
            })

            return originalFetch.apply(WINDOW, args)
                .then(res => {
                    triggerHandlers("fetch", {
                        ...handleData,
                        endTimestamp: Date.now(),
                        response: res
                    })
                }, err => {
                    triggerHandlers("error", {
                        ...handleData,
                        error: err,
                        endTimestamp: Date.now()
                    })

                    throw err
                })
        }
    })
}


let lastHref;
function handleHistory(){
    // popstate
    const oldPopstate = WINDOW.onpopstate
    const from = lastHref
    const to = WINDOW.location.href;
    lastHref = to

    triggerHandlers("history", {
        from,
        to
    })

    if(oldPopstate) {
        try {
            return oldPopstate.apply(WINDOW, [].slice.call(arguments))
        } catch (error) {
            triggerHandlers("error", {
                error,
                endTimestamp: Date.now()
            })
        }
    }

    // pushState, replaceState(state, title, url)
    function handleState(
        originalState
    ) {
        return function(this:History) {
            const args = [].slice.call(arguments, 1)

            const [state = null, title = '', url = ''] = args
            if(url) {
                const from = lastHref
                const to = url + ''
                lastHref = to

                triggerHandlers("history", {
                    from,
                    to,
                    params: state
                })
            }

            return originalState.apply(this, args)
        }
    }

    fill(WINDOW.history, "pushState", handleState)
    fill(WINDOW.history, "replaceState", handleState)
}

function handleXHR(){
    const proto = XMLHttpRequest.prototype
    // xhr.open(method, url, async)
    fill(proto, "open", function(originalOpen) {
        return function(this, ...args:any[]) {
            const xhr = this
            const url = args[1]

            const xhrInfo:IXHRInfo = xhr.__SENTRY__XHR = {
                method: String(args[0]).toLocaleLowerCase(),
                url
            }

            fill(xhr, "onreadystatechange", function(originalReadyState){
                return function(...readyStateArgs:any[]) {
                    if(xhr.readyState === 4) {
                        xhrInfo.status = xhr.status
                        xhr.__SENTRY__XHR.status = xhr.status
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

            originalOpen.apply(xhr, args)
        }
    })

    // send(data)
    fill(proto, "send", function(originalSend) {
        return function(this, ...args) {
            this.__SENTRY__XHR.body = args[0]
            triggerHandlers("xhr", {
                args,
                startTimestamp: Date.now(),
                xhr: this
            })

            return originalSend.apply(this,args);
        }
    })
}

function handleConsole(){
    CONSOLE_LEVELS.forEach(level => {
        if(!(level in WINDOW.console)) {
            return
        }

        fill(WINDOW.console, level, function(originalConsole) {
            // 返回包装函数
            return function(...args: any[]) {
                triggerHandlers("console", {
                    args,
                    level
                })

                if(originalConsole) {
                    originalConsole.apply(WINDOW.console, args)
                }
            }
        })
    })
}