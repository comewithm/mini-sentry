import { IClientOptions } from "./options";


export interface IClient<O extends IClientOptions = IClientOptions> {

    // 捕获消息
    captureMessage(message: any, hint?: any):void;

    captureException(exception: any, hint?: any): void;

    getOptions(): O;

}
