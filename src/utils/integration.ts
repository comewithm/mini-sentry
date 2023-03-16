
const handlers: {
    [key in HandleType]?: HandleCallback[]
} = {}

const isCollect: {
    [key in HandleType]?: boolean
} = {}

export function addIntoHandle(type: HandleType, callback: HandleCallback) {
    handlers[type] = handlers[type] || [];
    (handlers[type] as HandleCallback[]).push(callback)

    collectType(type)
}

function collectType(type: HandleType) {
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
            break;
        default:
            return;
    }
}

function handleError(){}

function handlerUnhandledrejection(){}

function handleFetch(){}

function handleHistory(){}

function handleXHR(){}