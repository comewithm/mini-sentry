import { IIntegration, IIntegrationIndex, IOptions } from "interface"
import { addGlobalEvent, getCurrentStore } from "./store"


export function mergeIntegrations(options:IOptions) {
    const defaultIntegrations = options.defaultIntegrations

    const userIntegrations = options.integrations

    let integrations:any[] = []

    if(Array.isArray(userIntegrations)) {
        integrations = [
            ...defaultIntegrations,
            ...userIntegrations
        ]
    } else {
        integrations = defaultIntegrations
    }

    return integrations
}

export const installedIntegrations:string[] = []

export function setupIntegrations(integrations:IIntegration[]):IIntegrationIndex {
    const integrationIndex:IIntegrationIndex = {}
    integrations.forEach(integration => {
        integration && setupIntegration(integration, integrationIndex)
    })
    return integrationIndex
}

export function setupIntegration(
    integration:IIntegration, 
    integrationIndex:IIntegrationIndex
) {
    integrationIndex[integration.name] = integration

    if(installedIntegrations.indexOf(integration.name) === -1) {
        // 统一处理setup函数的调用
        integration.setup(addGlobalEvent, getCurrentStore)
        installedIntegrations.push(integration.name)
    }

}