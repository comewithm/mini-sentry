import { THandleCallback, THandleType } from "interface";
import { IFetchData } from "interface/request";
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

function handlerUnhandledrejection(){}

function handleFetch(){

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

function handleHistory(){}

function handleXHR(){}

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