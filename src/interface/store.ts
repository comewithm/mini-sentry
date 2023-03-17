
import { IRedux } from "integration/redux";
import { IBreadCrumb, IBreadCrumbHint } from "./breadcrumb";
import { IClient } from "./client";
import { IEventHint } from "./event";


export interface IStoreInfo {
    client: IClient,
    redux: IRedux
}

export interface IStore {

    bindClient(client: IClient):void

    getClient(): IClient | undefined

    addBreadcrumb(breadCrumb: IBreadCrumb, hint?: IBreadCrumbHint):void

    captureException(exception: any, hint?: IEventHint): string

    captureMessage(message: string, hint?: IEventHint): string

    captureEvent(event: Event, hint?: IEventHint): string
}