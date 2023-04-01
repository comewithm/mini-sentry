import { getGlobalInstance, GLOBAL_OBJ } from './helper'
import { __DEBUG__ } from 'sdk'

export const CONSOLE_LEVELS = ['warn', 'error', 'info', 'debug', 'log'] as const

type TConsoleLevel = (typeof CONSOLE_LEVELS)[number]

type TConsoleMethod = (...args: any[]) => void
type TConsoleMethods = Record<TConsoleLevel, TConsoleMethod>

// 控制是否打印
interface Logger extends TConsoleMethods {
  enable: () => void
  disable: () => void
}

function sandboxConsole(callback: () => void) {
  if (!('console' in GLOBAL_OBJ)) {
    return callback()
  }

  // 拿到未改写的console方法，这样就不会在调用console打印时，被捕获而导致循环调用问题
  // 打印完成后，还需要将状态转换回来
  const originalConsole = GLOBAL_OBJ.console as Console
  // 临时存储包装类型函数，方便之后还原
  const tempConsoleLevel = {}

  CONSOLE_LEVELS.forEach((level) => {
    // 原生方法
    const originalFunc =
      originalConsole[level] &&
      (originalConsole[level] as any).__sentry_original__
    // 原生方法存在
    if (level in originalConsole && originalFunc) {
      tempConsoleLevel[level] = originalConsole[level]
      originalConsole[level] = originalFunc
    }
  })

  try {
    return callback()
  } finally {
    // 转换为包装状态
    Object.keys(tempConsoleLevel).forEach((level) => {
      originalConsole[level] = tempConsoleLevel[level]
    })
  }
}

function executeLogger() {
  let enable = false
  let logger: Partial<Logger> = {
    enable: () => {
      enable = true
    },
    disable: () => {
      enable = false
    },
  }
  if (__DEBUG__) {
    // 打印
    CONSOLE_LEVELS.forEach((level) => {
      // 赋值
      logger[level] = (...args: any[]) => {
        // 是否可以打印
        if (enable) {
          sandboxConsole(() => {
            GLOBAL_OBJ.console[level](`CONSOLE_${level}`, ...args)
          })
        }
      }
    })
  } else {
    CONSOLE_LEVELS.forEach((level) => {
      logger[level] = () => undefined
    })
  }

  return logger as Logger
}

let logger: Logger

if (__DEBUG__) {
  // debug调试 添加到全局属性中
  logger = getGlobalInstance('logger', executeLogger)
} else {
  logger = executeLogger()
}

export { logger }
