import { IBreadCrumb } from 'interface/breadcrumb'

export interface IRedux {
  addBreadCrumb(breadCrumb: IBreadCrumb, maxBreadCrumb?: number): this

  updateUserInfo(initUserInfo: any): this

  clear(): this

  setItemInLocal(): this

  hasItemInLocal(): boolean
}
