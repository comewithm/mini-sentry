import { IUserInfo } from './store'

export interface IReporter {
  getReportByType(): void

  sendReport(): void
}

export type TReportType = 'error'

export interface IReportInfo {
  user: IUserInfo
  reportType: string
  createTime: number
  detail: object
  customInfo?: object
}
