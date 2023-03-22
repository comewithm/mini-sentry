
function isGlobalObject(obj) {
    return obj && obj.Math == Math ? obj : undefined
}

export const GLOBAL_OBJ = 
    (typeof globalThis == 'object' && isGlobalObject(globalThis)) ||
    (typeof window == 'object' && isGlobalObject(window)) ||
    (typeof self == 'object' && isGlobalObject(self)) || 
    (typeof global == 'object' && isGlobalObject(global)) ||
    (function(this:any){ return this })() ||
    {};

export const WINDOW = GLOBAL_OBJ

export function getGlobalInstance(name, customClassInstance:() => any, ins?: any) {
    const obj = ins || GLOBAL_OBJ
    const __SENTRY__ = obj.__SENTRY__ || {}

    const instance = __SENTRY__[name] || (__SENTRY__[name] = customClassInstance())

    return instance
}


export function arrayToString(args:any[], separator:string = " ") {
    const message:any[] = []

    args.forEach(v => {
        message.push(v + '')
    })

    return message.join(separator)
}


export function getTimestamp() {
    return Date.now()
}

export function createUUID() {
    return URL.createObjectURL(new Blob([''])).split('/').pop() as string
}


export function circulateTimestamp(lastTime:number = getTimestamp()) {
    const now = getTimestamp()

    const leaveTimestamp = now - lastTime;

    lastTime = now

    return leaveTimestamp
}