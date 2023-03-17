import {  initClient } from "./client";
import { IClientOptions } from "interface/options";
import { BrowserClient } from "integration/client";
import { BreadCrumb } from "integration/breadcrumb";
import { mergeIntegrations } from "core/integrations";
import { IOptions } from "interface";
import { GlobalHandler } from "integration/globalhandler";


export const defaultIntegrations = [
    new BreadCrumb(),
    new GlobalHandler()
]

export function init(options: IOptions) {

    if(options.defaultIntegrations == undefined) {
        options.defaultIntegrations = defaultIntegrations
    }
    
    // 默认值和手动设置值合并
    const baseOptions:IClientOptions = {
        ...options,
        integrations: mergeIntegrations(options)
    }

    // 实例类，不是抽象类
    initClient(BrowserClient,  baseOptions)
}