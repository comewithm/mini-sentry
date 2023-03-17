import { getCurrentStore } from "core/store";
import { IRedux } from "integration/redux";
import { IClient } from "interface/client";
import { IEventHint } from "interface/event";
import { IClientOptions } from "interface/options";

type ClientClass<F extends IClient, T extends IClientOptions> = new (options: T) => F

// 包含所有方法
export abstract class BaseClient<O extends IClientOptions> implements IClient<O>{

    public readonly options: O;

    constructor(options) {
        this.options = options
    }

    public captureMessage(message: any, hint: IEventHint, redux?:IRedux): string | undefined {
        return
    }

    public captureException(exception: any, hint?: IEventHint, redux?:IRedux): string | undefined {
        let eventId:string | undefined = hint?.event_id
        console.log("capture exception:", exception)
        console.log("capture event hint:", hint)
        return eventId
    }

    public captureEvent(event: Event, hint?: IEventHint | undefined, redux?: IRedux | undefined): string | undefined {
        let eventId:string | undefined = hint?.event_id
        console.log("capture event:", event)
        console.log("capture event hint:", hint)
        return eventId
    }

    public getOptions(): O {
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