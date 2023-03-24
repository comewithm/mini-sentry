import { IRedux } from "integration/redux"
import { IBreadCrumb, IBreadCrumbHint, MAX_BREADCRUMB } from "interface/breadcrumb"
import { IClient } from "interface/client"
import { IEventHint } from "interface/event"
import { IClientOptions } from "interface/options"
import { IStore, IStoreInfo } from "interface/store"
import { createUUID, getGlobalInstance, getTimestamp, GLOBAL_OBJ } from "utils/helper"
import { Redux } from "./redux"


export class Store implements IStore{

    private readonly storeStack: IStoreInfo[] = [{}]

    private eventId?:string



    constructor(client?:IClient, redux:Redux = new Redux()) {
        this.getStore().redux = redux
        if(client) {
            this.bindClient(client)
        }
    }

    public getStore():IStoreInfo {
        return this.storeStack[this.storeStack.length - 1]
    }

    public bindClient(client: IClient<IClientOptions>): void {
        this.getStore().client = client
        // 绑定之后再初始化integrations
        if(client && client.setupIntegrations) {
            client.setupIntegrations()
        }
    }

    public getClient(): IClient | undefined {
        const top = this.getStore()
        return top.client
    }

    public getRedux(): IRedux | undefined {
        return this.getStore().redux
    }

    public setStoreCallback(callback:(client: IClient, redux: IRedux) => void){
        const {client, redux} = this.getStore()

        if(client) {
            callback(client, redux)
        }
    }

    public captureException(exception: any, hint?: IEventHint): string {
        this.eventId = hint && hint.event_id ? hint.event_id : createUUID()
        const eventId = this.eventId!
        const syntheticException = new Error("Sentry syntheticException")

        this.setStoreCallback((client, redux) => {
            client.captureException(exception, {
                originalException: exception,
                syntheticException,
                ...hint,
                event_id: eventId
            }, redux)
        })
        return eventId
    }

    public captureMessage(message: string, hint?: IEventHint): string {
        this.eventId = hint && hint.event_id ? hint.event_id : createUUID()
        const eventId = this.eventId
        const syntheticException = new Error(message)

        this.setStoreCallback((client, redux) => {
            client.captureMessage(message, {
                originalException:message,
                syntheticException,
                ...hint,
                event_id: eventId
            }, redux)
        })

        return eventId
    }

    public captureEvent(event: Event, hint?: IEventHint | undefined): string {
        const eventId = hint && hint.event_id ? hint.event_id : createUUID()
        if(!event.type) {
            this.eventId = eventId
        }

        this.setStoreCallback((client, redux) => {
            client.captureEvent(event, {
                ...hint,
                event_id: eventId
            }, redux)
        })

        return eventId
    }


    public addBreadcrumb(breadCrumb: IBreadCrumb, hint?: IBreadCrumbHint): void {
        const {client, redux} = this.getStore()

        if(!client) return

        // 这里是用户选项设置的属性
        // const {beforeCrumb = null, maxBreadCrumb = MAX_BREADCRUMB} = client.getOptions()

        const timestamp = getTimestamp()

        const mergedBreadcrumb = {
            timestamp,
            ...breadCrumb
        }

        // TODO:设置scope???
        redux.addBreadCrumb(mergedBreadcrumb)
    }

}


export function getMain() {
    GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
        store: undefined
    }

    return GLOBAL_OBJ
}

export function hasStore() {
    return !!(GLOBAL_OBJ && GLOBAL_OBJ.__SENTRY__ && GLOBAL_OBJ.__SENTRY__.store)
}

export function createStore(register, store:Store): boolean {
    if(!register) {
        // 不存在
        return false
    }

    const __SENTRY__ = register.__SENTRY__ || {}

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

export function addGlobalEvent(callback) {
    getGlobalInstance('globalEvent', () => []).push(callback)
}