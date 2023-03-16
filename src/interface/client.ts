import { IClientOptions } from "./options";


export interface IClient<O extends IClientOptions = IClientOptions> {

    // 捕获事件
    captureEvent(exception: any, hint: any):void;

    // 捕获消息
    captureMessage(message: any, hint: any):void;

    getOptions(): O;
}
