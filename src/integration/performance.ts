import { getCurrentStore } from 'core/store'
import { IPerformanceInfo, IPVUVInfo } from 'interface/performance'
import { logger } from 'utils/console'
import { WINDOW } from 'utils/helper'

const initPVUV: IPVUVInfo = {
  PV: 0,
  UV: 0,
}

export let PVUVInfo = {} as IPVUVInfo

export function getPerformance() {
  const { timing } = performance
  const {
    navigationStart,
    redirectStart,
    redirectEnd,
    fetchStart,
    domainLookupStart,
    domainLookupEnd,
    connectStart,
    connectEnd,
    requestStart,
    responseStart,
    responseEnd,
    loadEventStart,
  } = timing

  const pageLoadTime = loadEventStart - navigationStart
  const whiteScreenTime = responseStart - navigationStart
  const redirectTime = redirectEnd - redirectStart
  const appCacheTime = domainLookupStart - fetchStart
  const dnsTime = domainLookupEnd - domainLookupStart
  const tcpTime = connectEnd - connectStart
  const requestTime = responseEnd - requestStart

  const performanceInfo: IPerformanceInfo = {
    pageLoadTime,
    whiteScreenTime,
    directTime: redirectTime,
    appCacheTime,
    dnsTime,
    tcpTime,
    requestTime,
  }

  return performanceInfo
}

export function getPerformanceEntries() {
  const performance = WINDOW.performance.getEntries()

  const info = performance[0] as PerformanceNavigationTiming

  const {
    unloadEventStart,
    unloadEventEnd,
    redirectStart,
    redirectEnd,
    fetchStart,
    domainLookupStart,
    domainLookupEnd,
    connectStart,
    connectEnd,
    requestStart,
    responseStart,
    responseEnd,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    domComplete,
    loadEventStart,
    loadEventEnd,
  } = info

  // 重定向时间
  const redirectTime = redirectEnd - redirectStart
  // 缓存时间
  const appCacheTime = domainLookupStart - fetchStart
  // dns查询时间
  const dnsTime = domainLookupEnd - domainLookupStart
  // tcp连接时间
  const tcpTime = connectEnd - connectStart
  // 请求时间
  const requestTime = responseEnd - requestStart
  // 请求完成到DOM加载时间
  const beforeDomLoadTime = domInteractive - responseEnd
  // 从开始到load时间
  const pageLoadTime = loadEventEnd - fetchStart
  // 白屏时间
  const whiteScreenTime = responseStart - fetchStart
  // 首屏时间
  const firstScreenTime = domComplete - fetchStart
  // DOMReady时间
  const domReadyTime = domContentLoadedEventStart - fetchStart

  const performanceInfo: IPerformanceInfo = {
    pageLoadTime,
    whiteScreenTime,
    directTime: redirectTime,
    appCacheTime,
    dnsTime,
    tcpTime,
    requestTime,
    beforeDomLoadTime,
    firstScreenTime,
    domReadyTime,
  }

  logger.log('performance entries:', info, performanceInfo)

  return performanceInfo
}

// 获取当前的PV,UV
export function initTotalPV() {
  let PVInfo
  let hasPV = localStorage.getItem('PV_UV')
  if (!!hasPV) {
    PVInfo = JSON.parse(hasPV || '')
  } else {
    PVInfo = initPVUV
  }

  PVUVInfo = PVInfo

  return PVUVInfo
}

const redux = getCurrentStore().getRedux()

// 计算PV,UV
export function circulateTotalPV() {
  const { PV, UV } = PVUVInfo
  // UV计算应该根据用户唯一标识计算(根据用户输入的初始化用户配置信息)
  PVUVInfo = {
    UV: redux?.hasItemInLocal() ? UV : UV + 1,
    PV: PV + 1,
  }

  localStorage.setItem('PV_UV', JSON.stringify(PVUVInfo))

  return PVUVInfo
}

export function getCurrentPathPV(currentPath: string): number {
  let currentPV = localStorage.getItem(`PV_${currentPath}`) || 0

  currentPV = +currentPV + 1

  localStorage.setItem(`PV_${currentPath}`, JSON.stringify(currentPV))

  return currentPV
}
