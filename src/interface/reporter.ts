import { THandleType } from 'interface'
import { IUserInfo } from './store'

export interface IReporter {
  sendReport(): void
}

export type TReportType = THandleType

export type TReportInfo = {
  reportType: TReportType[]
  reporturl: string
}

export interface IReportInfo {
  user?: IUserInfo
  reportType: TReportType
  createTime?: number
  detail?: object
  customInfo?: object
}
