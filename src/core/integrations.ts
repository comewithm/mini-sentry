import { IOptions } from "interface"


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