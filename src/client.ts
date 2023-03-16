import { getCurrentStore } from "core/store";
import { IClient } from "interface/client";
import { IClientOptions } from "interface/options";

type ClientClass<F extends IClient, T extends IClientOptions> = new (options: T) => F

// 包含所有方法
export abstract class BaseClient<O extends IClientOptions> implements IClient<O>{

    readonly options: O;

    constructor(options) {
        this.options = options
    }

    captureEvent(exception: any, hint: any): void {
        
    }

    captureMessage(message: any, hint: any): void {
        
    }

    getOptions(): O {
        return this.options
    }

}



export function initClient<F extends IClient, T extends IClientOptions>(
    clientClass:ClientClass<F, T>, 
    options: T
) {

    // 数据中心获取
    const store = getCurrentStore()

    
    const client = new clientClass(options)

    // 绑定client
    store.bindClient(client)
}