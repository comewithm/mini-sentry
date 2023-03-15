import { instrumentErrors } from "error"
import { instrumentHistory } from "modify/history"
import { instrumentFetch, instrumentXHR } from "modify/request"

export const collections: {
    [key in keyof Collect]?: ((data) => void)[]
} = {}

export const shouldTrigger:{
    [key in keyof Collect]: boolean
} = {}

// 触发之前需要先收集相关函数
export const triggerHandlers = (type: keyof Collect, data: any) => {
    // 会被覆盖(比如多次调用fetch) 后面需要修改

    if(!type || !collections[type]) {
        return
    }

    for(const handler of collections[type]!) {
        handler(data)
    }
}

export function addHandlers(type: keyof Collect, callback: () => void) {
    collections[type] = collections[type] || []
    collections[type]!.push(callback)
    triggerRelativeInstrument(type)
}

export function triggerRelativeInstrument(type: keyof Collect) {
    shouldTrigger[type] = true
    
    switch(type) {
        case "exception":
            instrumentErrors()
            break;
        case "fetch":
            instrumentFetch()
            break
        case "xhr":
            instrumentXHR()
            break
        case "history":
            instrumentHistory()
            break
        case "pageView":

        case "performance":

    }
}