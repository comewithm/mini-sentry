import { SHOULD_LOG } from 'cons'
import { getCurrentStore } from 'core/store'
import { IIntegration } from 'interface'
import { IBreadCrumb, IBreadCrumbOptions } from 'interface/breadcrumb'
import { IPerformanceInfo } from 'interface/performance'
import { IFetchData, IHistoryData, IXHRData } from 'interface/request'
import { arrayToString } from 'utils/helper'
import { pushHandlers } from 'utils/integration'
import {
  initTotalPV,
  getPerformance,
  getPerformanceEntries,
} from './performance'

type THandleData = Record<string, unknown>

export class BreadCrumb implements IIntegration {
  public static id = 'breadcrumb'

  public name = BreadCrumb.id

  public options: IBreadCrumbOptions

  constructor(options?: Partial<IBreadCrumbOptions>) {
    SHOULD_LOG && console.log('init breadcrumb', options)
    this.options = {
      console: false,
      xhr: true,
      fetch: true,
      history: true,
      performance: true,
      ...options,
    }
  }

  public setup(): void {
    // 所有数据需要被收集起来
    if (this.options.performance) {
      // performance应该在onload时触发
      // performanceCallback(getPerformance())
      performanceCallback(getPerformanceEntries())
    }
    if (this.options.console) {
      pushHandlers('console', consoleCallback)
    }
    if (this.options.xhr) {
      pushHandlers('xhr', xhrCallback)
    }
    if (this.options.fetch) {
      pushHandlers('fetch', fetchCallback)
    }
    if (this.options.history) {
      // 有history就计算PV,UV
      initTotalPV()
      pushHandlers('history', historyCallback)
    }
  }
}

// handleData为触发addIntoHandle(type, data)中的data
function consoleCallback(
  handleData: THandleData & { args: unknown[]; level: string }
) {
  const crumb: IBreadCrumb = {
    type: 'console',
    data: {
      args: handleData.args,
      logger: 'console',
    },
    level: handleData.level,
    message: arrayToString(handleData.args),
  }

  // 添加到store中

  getCurrentStore().addBreadcrumb(crumb, {
    level: handleData.level,
    args: handleData.args,
  })
}

function xhrCallback(handleData: IXHRData) {
  const { startTimestamp, endTimestamp } = handleData
  if (!startTimestamp || !endTimestamp) {
    return
  }

  const { method, url, status, body } = handleData.xhr.__SENTRY__XHR

  const xhrData = {
    method,
    url,
    status,
  }

  const hint = {
    xhr: handleData.xhr,
    input: body,
    startTimestamp,
    endTimestamp,
  }

  getCurrentStore().addBreadcrumb(
    {
      type: 'xhr',
      superType: 'http',
      data: xhrData,
    },
    hint
  )
}

function fetchCallback(handleData: THandleData & IFetchData) {
  // 请求成功或者请求失败
  if (handleData.error) {
    getCurrentStore().addBreadcrumb(
      {
        type: 'fetch',
        data: handleData,
        level: 'error',
        superType: 'http',
      },
      {
        data: handleData.error,
        input: handleData.args,
      }
    )
  } else {
    getCurrentStore().addBreadcrumb(
      {
        type: 'fetch',
        data: {
          ...handleData,
          statusCode: handleData.response && handleData.response.status,
        },
        superType: 'http',
      },
      {
        input: handleData.args,
        response: handleData.response,
      }
    )
  }
}

function historyCallback(handleData: IHistoryData) {
  // const {from, to, params} = handleData

  getCurrentStore().addBreadcrumb({
    type: 'navigation',
    superType: 'history',
    data: handleData,
  })
}

function performanceCallback(performanceInfo: IPerformanceInfo) {
  getCurrentStore().addBreadcrumb({
    type: 'performance',
    data: performanceInfo,
  })
}
