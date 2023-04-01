import { getCurrentStore, Store } from 'core/store'
import { IIntegration } from 'interface'
import { logger } from 'utils/console'
import { pushHandlers } from 'utils/integration'

type TGlobalHandleOption = {
  onerror: boolean
  onunhandledrejection: boolean
}

type TGlobalHandleOptionKeys = keyof TGlobalHandleOption

export class GlobalHandler implements IIntegration {
  public static id: string = 'global_handler'

  public name: string = GlobalHandler.id

  private readonly options: TGlobalHandleOption

  private initOption: Record<
    TGlobalHandleOptionKeys,
    (() => void) | undefined
  > = {
    onerror: globalErrorHandler,
    onunhandledrejection: globalRejectionHandler,
  }

  constructor(options?: TGlobalHandleOption) {
    logger.log('init GlobalHandler', options)
    this.options = {
      onerror: true,
      onunhandledrejection: true,
      ...options,
    }
  }

  public setup() {
    const options = this.options

    for (const key in options) {
      const fun = this.initOption[key]
      fun()
      this.initOption[key] = undefined
    }
  }
}

function globalErrorHandler() {
  logger.log('init globalErrorHandler')
  // 执行error回调
  /*
        onerror: {event:{message,url,line,col}, error}
        addEventListener: {event}
    */
  pushHandlers(
    'error',
    function errorCallback(errorInfo: { error: any; event: any }) {
      const store = getCurrentStore()
      let event
      if (errorInfo.error) {
        // onerror错误
        event = {
          ...errorInfo,
          level: 'error',
        }
        addEventAndCapture(store, errorInfo.error, event, 'error')
      } else {
        // addEventListener错误
        event = {
          ...errorInfo.event,
          level: 'error',
        }
        addEventAndCapture(store, errorInfo.event, event, 'error')
      }
    }
  )
}

function globalRejectionHandler() {
  // 执行unhandledrejection回调
  logger.log('init globalRejectionHandler')

  pushHandlers('unhandledrejection', function unhandledCallback(eve: any) {
    logger.log('globalRejectionHandler error:', eve)

    let error = eve.event

    error.level = 'error'

    const store = getCurrentStore()

    const event = {
      type: 'unhandledrejection',
      value: error,
    }

    addEventAndCapture(store, error, event, 'unhandledrejection')
  })
}

function addEventAndCapture(
  store: Store,
  error: any,
  event: any,
  type: string
) {
  store.addBreadcrumb({
    data: event,
    type,
  })

  store.captureEvent(event, {
    originalException: error,
  })
}
