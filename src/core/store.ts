import { IBreadCrumb } from "interface/breadcrumb"
import { IClient } from "interface/client"
import { IClientOptions } from "interface/options"
import { IStore, IStoreInfo } from "interface/store"
import { getGlobalInstance, getTimestamp, GLOBAL_OBJ } from "utils/helper"

const MAX_BREADCRUMB = 50

export class Store implements IStore{

    readonly storeStack: IStoreInfo[] = []

    constructor(client?:IClient) {
        if(client) {
            this.bindClient(client)
        }
    }

    getStore():IStoreInfo {
        return this.storeStack[this.storeStack.length - 1]
    }

    bindClient(client: IClient<IClientOptions>): void {
        const top = this.getStore()
        top.client = client
    }

    getClient(): IClient | undefined {
        const top = this.getStore()
        return top.client
    }


    addBreadcrumb(breadCrumb: IBreadCrumb, hint: any): void {
        const {client} = this.getStore()

        if(!client) return

        // 这里是用户选项设置的属性
        const {beforeCrumb = null, maxBreadCrumb = MAX_BREADCRUMB} = client.getOptions()

        const timestamp = getTimestamp()

        const mergedBreadcrumb = {
            timestamp,
            ...breadCrumb
        }

        // TODO:设置scope???

    }

}


export function getMain() {
    GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
        store: undefined
    }

    return GLOBAL_OBJ
}

export function hasStore() {
    return !!(GLOBAL_OBJ && GLOBAL_OBJ.__SENTRY__ && GLOBAL_OBJ.__SENTRY__.hub)
}

export function createStore(register, store:Store): boolean {
    if(!register) {
        // 不存在
        return false
    }

    const __SENTRY__ = register.__SENTRY || {}

    __SENTRY__.store = store

    return true

}

export function getCurrentStore():Store{
    const register = getMain()

    if(!hasStore()) {
        createStore(register, new Store())
    }

    return getGlobalInstance('store', () => new Store() ,register)
}