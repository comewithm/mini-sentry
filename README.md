### mini-sentry

##### 初始化
目前还是直接在bundle中调用，rollup打包还是不熟悉。。。之后看看要怎么改。
```js
    init({
        integrations:[
            "fetch", 
            "xhr", 
            "history", 
            "error",
            "unhandledrejection",
            "performance"
        ],
        reportUrl: "http://xxx"
    })
```


| 配置 | 类型 | 说明 |
| ------ | ------ | ------ |
| `integrations` | `array` | 默认配置：监听异常，接口请求，PV，UV，路由跳转等 |
| `reportUrl` | `string` | 监听数据上传地址 |

