import { addIntoHandle } from "utils/integration";

export class BreadCrumb {
    public name;

    public options:BreadCrumbOptions

    constructor(options?: Partial<BreadCrumbOptions>) {
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

function consoleCallback(){}

function xhrCallback(){}

function fetchCallback(){}

function historyCallback(){}