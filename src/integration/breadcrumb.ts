import { getCurrentStore } from "core/store";
import { IBreadCrumbOptions } from "interface/breadcrumb";
import { arrayToString } from "utils/helper";
import { addIntoHandle } from "utils/integration";

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
            addIntoHandle("console", consoleCallback)
        }
        if(this.options.xhr) {
            addIntoHandle("xhr", xhrCallback)
        }
        if(this.options.fetch) {
            addIntoHandle("fetch", fetchCallback)
        }
        if(this.options.history) {
            addIntoHandle("history", historyCallback)
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

function fetchCallback(){}

function historyCallback(){}