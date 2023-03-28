import { BaseClient } from "client";
import { Reporter } from "core/reporter";
import { IClientOptions } from "interface/options";
import { WINDOW } from "utils/helper";


export class BrowserClient extends BaseClient<IClientOptions> {

    public report: Reporter

    constructor(options: IClientOptions){

        super(options)
        
        this.report = new Reporter(options.report)

        this.beforeUnload()
    }

    beforeUnload() {
        // 页面隐藏时可以触发 navigator.sendBeacon(url, data)
        const that = this
        if(WINDOW.document) {
            WINDOW.document.addEventListener("visibilitychange", function() {
                if(WINDOW.document.visibilityState === 'hidden') {
                    that.uploadData()
                }
            })
        }
    }

    uploadData() {
        this.report.sendReport()
    }

}