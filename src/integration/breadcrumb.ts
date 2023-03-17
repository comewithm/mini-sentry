import { getCurrentStore } from "core/store";
import { IBreadCrumbOptions } from "interface/breadcrumb";
import { IFetchData } from "interface/request";
import { arrayToString } from "utils/helper";
import { pushHandlers } from "utils/integration";

type THandleData = Record<string, unknown>

export class BreadCrumb {
    public name;

    public options:IBreadCrumbOptions

    constructor(options?: Partial<IBreadCrumbOptions>) {
        this.options = {
            console: true,
            xhr: true,
            fetch: true,
            history: true,
            performance: true,
            ...options
        }

        this.setup()
    }

    public setup(): void {
        // 所有数据需要被收集起来
        if(this.options.performance) {

        }
        if(this.options.console) {
            pushHandlers("console", consoleCallback)
        }
        if(this.options.xhr) {
            pushHandlers("xhr", xhrCallback)
        }
        if(this.options.fetch) {
            pushHandlers("fetch", fetchCallback)
        }
        if(this.options.history) {
            pushHandlers("history", historyCallback)
        }
    }
}

// handleData为触发addIntoHandle(type, data)中的data
function consoleCallback(handleData: THandleData & {args: unknown[]; level:string}){

    const crumb = {
        type: "console",
        data: {
            args: handleData.args,
            logger: "console"
        },
        level: handleData.level,
        message: arrayToString(handleData.args)
    }

    // 添加到store中

    getCurrentStore().addBreadcrumb(crumb, {
        level: handleData.level,
        args: handleData.data
    })
}

function xhrCallback(){}

function fetchCallback(handleData: THandleData & IFetchData){

    // 请求成功或者请求失败
    if(handleData.error) {
        getCurrentStore().addBreadcrumb({
            type: "fetch",
            data: handleData.data,
            level: 'error',
            superType: "http"
        }, {
            data: handleData.error,
            input: handleData.args
        })
    } else {
        getCurrentStore().addBreadcrumb({
            type: "fetch",
            data: {
                ...handleData.data,
                statusCode: handleData.response && handleData.response.status
            },
            superType: "http"
        }, {
            input: handleData.args,
            response: handleData.response
        })
    }
}

function historyCallback(){}