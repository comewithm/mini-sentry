import { BaseClient } from "client";
import { SHOULD_LOG } from "cons";
import { getCurrentStore } from "core/store";
import { IClientOptions } from "interface/options";
import { WINDOW } from "utils/helper";



export class BrowserClient extends BaseClient<IClientOptions> {


    constructor(options: IClientOptions){

        super(options)

        // 页面隐藏时可以触发 navigator.sendBeacon(url, data)
        if(WINDOW.document) {
            WINDOW.document.addEventListener("visibilitychange", function() {
                if(WINDOW.document.visibilityState === 'hidden') {
                    // sendBeacon()
                    const breadCrumb = getCurrentStore().getRedux();
                    SHOULD_LOG && console.log("send beacon data", breadCrumb)
                }
            })
        }
    }

    
}


// 上传数据  navigator.sendBeacon(url, sendData)
function sendBeacon(url, sendData) {
    const params = typeof sendData === 'string' ? sendData : JSON.stringify(sendData);

    const image = new Image(1, 1)
    const src = `${url}?${params}`

    image.src = src

    return new Promise((resolve, reject) => {
        image.onload = function() {
            resolve({
                code: 200,
                data: '',
                message: "success"
            })
        }

        image.onerror = function(e) {
            const err = typeof e === 'object' ? e.error : e
            reject(new Error(err))
        }
    })
}