import { getCurrentStore, Store } from "core/store";
import { pushHandlers } from "utils/integration";


type TGlobalHandleOption = {
    onerror: boolean;
    onunhandledrejection: boolean;
}

type TGlobalHandleOptionKeys = keyof TGlobalHandleOption

export class GlobalHandler {
    public static id:string = "global_handler";

    public name:string = GlobalHandler.id;

    private readonly options:TGlobalHandleOption

    private initOption: Record<TGlobalHandleOptionKeys, (() => void) | undefined> = {
        onerror: globalErrorHandler,
        onunhandledrejection: globalRejectionHandler
    }

    constructor(options?:TGlobalHandleOption) {
        this.options = {
            onerror: true,
            onunhandledrejection: true,
            ...options
        }

        this.setup()
    }

    public setup() {
        const options = this.options

        for (const key in options) {
            const fun = this.initOption[key]
            fun()
            this.initOption[key] = undefined
        }
    }

}

function globalErrorHandler(){
    // 执行error回调
    pushHandlers("error", function errorCallback(
        errorInfo: {
            message: any,
            url: any,
            line:any,
            col: any,
            error: any
        }
    ) {
        // TODO
        const store = getCurrentStore()

        const event = {
            ...errorInfo,
            level: "error"
        }



        addEventAndCapture(store, errorInfo.error, event, "onerror")
    })
}

function globalRejectionHandler(){
    // 执行unhandledrejection回调
}


function addEventAndCapture(
    store: Store,
    error: any,
    event: any,
    type: string
) {

    store.captureEvent(event, {
        originalException: error
    })
}