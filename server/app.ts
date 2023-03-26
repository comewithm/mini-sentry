import http from 'http'
import bodyParser from 'body-parser'
import express from 'express'
import createError from 'http-errors'

import path from 'path'

const port = 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

const server = http.createServer(app)

// 设置跨域访问
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  // 携带cookie
  res.header('Access-Control-Allow-Credentials', 'true')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', [
    'X-PINGOTHER',
    'content-type',
    'Origin',
    'X-Requested-With',
  ])
  // 设置跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')

  res.header('Access-COntrol-Max-Age', `${20}`)

  // 让options尝试请求快速结束
  if (req.method.toLocaleLowerCase() === 'options') {
    res.send(200)
  } else {
    next()
  }
})

app.post('/xhr', async (_req, _res) => {
  console.log('xhr: receive request')
  await sleep(10 * 1000)
  _res.json({
    code: 10000,
  })
})

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

app.get('/fetch', async (_req, _res) => {
  console.log('fetch: receive request', _req.url)
  return _res.json({
    code: 10000,
    success: 'ok',
    data: {
      name: 'Jay',
    },
  })
})

app.get('/test1', (_req, _res) => {
  return _res.json({
    message: 'test success',
  })
})

app.get('/test2', (_req, _res) => {
  _res.send('test2')
})

app.get('*', (_req, _res) => {
  _res.sendFile(path.resolve(__dirname, '../src/test/page1.html'))
})

server.listen(port, () => {
  console.log('监听端口: ', port)
})

// catch 404
app.use(function (_req, _res, next) {
  const error = createError(404)
  next(error)
})

process.on(
  'unhandledRejection',
  (reason: {} | null | undefined, p: Promise<any>) => {
    console.error('自定义错误：unhandled Rejection', p, reason)
  }
)
