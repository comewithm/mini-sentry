import { IRedux } from "integration/redux";
import { IEventHint } from "./event";
import { IClientOptions } from "./options";


export interface IClient<O extends IClientOptions = IClientOptions> {

    // 捕获消息
    captureMessage(message: any, hint?: IEventHint, redux?:IRedux):string | undefined;

    captureException(exception: any, hint?: IEventHint, redux?:IRedux): string | undefined;

    captureEvent(event: Event, hint?: IEventHint, redux?:IRedux): string | undefined;

    getOptions(): O;

    setupIntegrations(): void

}
