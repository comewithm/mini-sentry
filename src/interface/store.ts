
import { IRedux } from "integration/redux";
import { IBreadCrumb } from "./breadcrumb";
import { IClient } from "./client";


export interface IStoreInfo {
    client: IClient,
    redux: IRedux
}

export interface IStore {

    bindClient(client: IClient):void

    getClient(): IClient | undefined

    addBreadcrumb(breadCrumb: IBreadCrumb, hint?: any):void

    captureException(exception: any, hint?: any): void

    captureMessage(message: string, hint?: any): void
}