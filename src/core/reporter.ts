import { TReportInfo, TReportType } from 'interface/reporter'
import { getCurrentStore } from './store'
import { IBreadCrumb } from 'interface/breadcrumb'
import { IIntegration } from 'interface'
import { getTimestamp } from 'utils/helper'

export class Reporter implements IIntegration {

  public static id = "Reporter"

  public name = Reporter.id

  reportOptions?:TReportInfo

  constructor(options?: TReportInfo) {
    this.reportOptions = {
      reportType: ['error', 'unhandledrejection', 'fetch', 'xhr', 'history'],
      reporturl: 'http://localhost:3000/report',
      ...options
    }
  }

  setup(): void {
    
  }

  sendReport() {
    // breadcrumb: {[type]: []}
    // this.reportOptions?.reportType: [type1, type2]
    const {breadcrumb, user} = getCurrentStore().getRedux()!.getAllReduxInfo()

    this.reportOptions?.reportType.forEach((type: TReportType) => {
      if(breadcrumb[type]) {
        // reportType中存在type
        const url = this.reportOptions?.reporturl!
        const data = breadcrumb[type]
        const createTime = getTimestamp()
        const sendData = {
          user: user.userInfo,
          reportType: type,
          createTime,
          detail: data,
        }
        sendBeacon(url, sendData)

        this.clearSendData(type)
      }
    })
  }

  clearSendData(type: TReportType) {
    // 发送了数据之后，本地Store中对应的数据需要清除，防止二次发送重复数据
    getCurrentStore().getRedux()?.clearBreadcrumbByType(type)
  }

  
}


// 上传数据  navigator.sendBeacon(url, sendData)
export function sendBeacon(url:string, sendData: any) {
  const params = typeof sendData === 'string' ? sendData : JSON.stringify(sendData);

  const image = new Image(1, 1)
  const src = `${url}?${params}`

  image.src = src

  return new Promise((resolve, reject) => {
      image.onload = function() {
          resolve({
              code: 200,
              data: '',
              message: "success"
          })
      }

      image.onerror = function(e) {
          const err = typeof e === 'object' ? e.error : e
          reject(new Error(err))
      }
  })
}