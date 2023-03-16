import {  initClient } from "./client";
import { ClientOptions } from "interface/options";
import { BrowserClient } from "integration/client";
import { BreadCrumb } from "integration/breadcrumb";
import { mergeIntegrations } from "core/integrations";


export const defaultIntegrations = [
    new BreadCrumb(),
]

export function init(options: Options) {

    if(options.defaultIntegrations == undefined) {
        options.defaultIntegrations = defaultIntegrations
    }
    
    // 默认值和手动设置值合并
    const baseOptions:ClientOptions = {
        ...options,
        integrations: mergeIntegrations(options)
    }

    // 实例类，不是抽象类
    initClient(BrowserClient,  baseOptions)
}