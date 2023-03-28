import { THandleType } from 'interface'
import { IBreadCrumb } from 'interface/breadcrumb'
import { IUserInfo } from 'interface/store'

export type TBreadCrumbByType = {
  [type in THandleType]?: IBreadCrumb[]
}

export type TReduxInfo = {
  breadcrumb: TBreadCrumbByType,
  user: IUserInfo
}

export interface IRedux {
  addBreadCrumb(breadCrumb: IBreadCrumb, maxBreadCrumb?: number): this

  clearBreadcrumbByType(type: THandleType): this 

  updateUserInfo(initUserInfo: any): this

  clear(): this

  setItemInLocal(): this

  hasItemInLocal(): boolean

  getAllReduxInfo(): TReduxInfo
}
