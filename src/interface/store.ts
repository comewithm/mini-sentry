
import { IBreadCrumb } from "./breadcrumb";
import { IClient } from "./client";


export interface IStoreInfo {
    client: IClient
}

export interface IStore {


    bindClient(client: IClient):void

    getClient(): IClient | undefined

    addBreadcrumb(breadCrumb: IBreadCrumb, hint: any):void
}