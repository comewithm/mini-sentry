

// fetch(input, init?:object)
export const getFetchMethod = (fetchArgs: any[]) => {
    if('Request' in window && fetchArgs[0] instanceof Request && fetchArgs[0].method) {
        return String(fetchArgs[0].method).toUpperCase()
    }
    if(fetchArgs[1] && fetchArgs[1].method) {
        return String(fetchArgs[1].method).toUpperCase()
    }
    return "GET"
}


export const getFetchUrl = (fetchArgs: any[]) => {
    if(typeof fetchArgs[0] === "string") {
        return fetchArgs[0]
    }

    if('Request' in window && fetchArgs[0] instanceof Request) {
        return fetchArgs[0].url
    }

    return String(fetchArgs[0])
}



export const fill = (
    source:object, 
    name:string, 
    replacementFactory:(...args:any[]) => any
) => {
    if(!(name in source)) {
        return
    }
    // 原属性上的方法
    const original = source[name] as Function
    // 执行包装函数
    const wrapped = replacementFactory(original)

    if(typeof wrapped === "function") {
        // 包装函数上添加原生函数
        markFunctionWrapped(wrapped, original)
    }
    // 替换为包装函数
    source[name] = wrapped
}


// 复制原方法及其原型作为一个新对象，不对源对象修改
export const markFunctionWrapped = (
    wrapped:Function,
    original:Function
) => {
    const proto = original.prototype || {}

    wrapped.prototype = original.prototype = proto

    Object.defineProperty(wrapped, "__sentry_original__", {
        value:  original,
        writable: true,
        configurable: true
    })
}