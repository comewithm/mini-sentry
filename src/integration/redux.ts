import { IBreadCrumb } from "interface/breadcrumb";

export interface IRedux {

    addBreadCrumb(breadCrumb: IBreadCrumb, maxBreadCrumb?: number): this

    clearBreadCrumb(): this
}