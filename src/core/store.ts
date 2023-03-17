import { IRedux } from "integration/redux"
import { IBreadCrumb, MAX_BREADCRUMB } from "interface/breadcrumb"
import { IClient } from "interface/client"
import { IClientOptions } from "interface/options"
import { IStore, IStoreInfo } from "interface/store"
import { getGlobalInstance, getTimestamp, GLOBAL_OBJ } from "utils/helper"
import { Redux } from "./redux"


export class Store implements IStore{

    readonly storeStack: IStoreInfo[] = []

    constructor(client?:IClient, redux:IRedux = new Redux()) {
        this.getStore().redux = redux
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

    getRedux(): IRedux | undefined {
        return this.getStore().redux
    }

    setStoreCallback(callback:(client: IClient, redux: IRedux) => void){
        const {client, redux} = this.getStore()

        if(client) {
            callback(client, redux)
        }
    }

    captureException(exception: any, hint?: any): void {
        const {client} = this.getStore()

        client.captureException(exception, hint)
    }

    captureMessage(message: string, hint?: any): void {
        const {client} = this.getStore()
        
        client.captureMessage(message, hint)
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