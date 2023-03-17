import { IRedux } from "integration/redux";
import { IBreadCrumb, MAX_BREADCRUMB } from "interface/breadcrumb";


export class Redux implements IRedux {

    breadcrumb: IBreadCrumb[]

    constructor() {
        this.breadcrumb = []
    }

    addBreadCrumb(breadCrumb: IBreadCrumb, maxBreadCrumb?: number): this {
        const maxCrumbs = typeof maxBreadCrumb === 'number' ? maxBreadCrumb : MAX_BREADCRUMB

        if(maxCrumbs < 0) {
            return this
        }

        const mergedBreadcrumb = {
            timestamp: Date.now(),
            ...breadCrumb
        }

        this.breadcrumb = [
            ...this.breadcrumb,
            mergedBreadcrumb
        ]

        return this
    }

    clearBreadCrumb(): this {
        this.breadcrumb = []
        return this
    }
}