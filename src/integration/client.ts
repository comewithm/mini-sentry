import { BaseClient } from "client";
import { IClientOptions } from "interface/options";



export class BrowserClient extends BaseClient<IClientOptions> {


    constructor(options: IClientOptions){

        super(options)

        // 页面隐藏时可以触发 navigator.sendBeacon(url, data)
        /*
            data: 
                performance
                
        */
    }

    
}