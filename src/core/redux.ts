import { IRedux } from "integration/redux";
import { IBreadCrumb, MAX_BREADCRUMB } from "interface/breadcrumb";
import { getTimestamp } from "utils/helper";


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
            timestamp: getTimestamp(),
            ...breadCrumb
        }

        this.breadcrumb = [
            ...this.breadcrumb,
            mergedBreadcrumb
        ]

        console.log("this.breadcrumb:", this.breadcrumb)

        return this
    }

    clearBreadCrumb(): this {
        this.breadcrumb = []
        return this
    }
}