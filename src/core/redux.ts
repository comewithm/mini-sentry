import { IRedux, TBreadCrumbByType, TReduxInfo } from 'integration/redux'
import { THandleType } from 'interface'
import { IBreadCrumb, MAX_BREADCRUMB } from 'interface/breadcrumb'
import { IUserInfo } from 'interface/store'
import { getTimestamp } from 'utils/helper'

export class Redux implements IRedux {
  breadcrumb: TBreadCrumbByType

  user: IUserInfo

  constructor() {
    this.breadcrumb = {}
    this.user = {}
  }

  addBreadCrumb(breadCrumb: IBreadCrumb, maxBreadCrumb?: number): this {
    const maxCrumbs =
      typeof maxBreadCrumb === 'number' ? maxBreadCrumb : MAX_BREADCRUMB

    if (maxCrumbs < 0) {
      return this
    }

    const { type, superType } = breadCrumb

    const mergedBreadcrumb = {
      timestamp: getTimestamp(),
      ...breadCrumb,
    }

    this.breadcrumb[type] = [...(this.breadcrumb[type] || []), mergedBreadcrumb]

    console.log('this.breadcrumb:', this.breadcrumb)

    return this
  }

  getAllReduxInfo(): TReduxInfo {
    return {
      breadcrumb: this.breadcrumb,
      user: this.user,
    }
  }

  updateUserInfo(initUserInfo: IUserInfo): this {
    this.user = initUserInfo

    return this
  }

  clear(): this {
    this.breadcrumb = {}
    this.user = {}
    return this
  }

  clearBreadcrumbByType(type: THandleType): this {
    this.breadcrumb[type] = []
    return this
  }

  setItemInLocal(): this {
    const {
      userInfo: { id, name },
      userInfo,
    } = this.user
    localStorage.setItem(`${name}${id}`, JSON.stringify(userInfo))
    return this
  }

  hasItemInLocal(): boolean {
    const {
      userInfo: { id, name },
    } = this.user
    const info = localStorage.getItem(`${name}${id}`)

    if (!info) {
      this.setItemInLocal()
    }

    return !!info ? true : false
  }
}
