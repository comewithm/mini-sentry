import { BaseClient } from "client";
import { IClientOptions } from "interface/options";
import { WINDOW } from "utils/helper";



export class BrowserClient extends BaseClient<IClientOptions> {


    constructor(options: IClientOptions){

        super(options)

        // 页面隐藏时可以触发 navigator.sendBeacon(url, data)
        /*
            data: 
                performance
                
        */

        if(WINDOW.document) {
            if(WINDOW.document.visibilityState === 'hidden') {
                sendData()


            }
        }
    }

    
}


// 上传数据  navigator.sendBeacon(url, sendData)
function sendData(){

}