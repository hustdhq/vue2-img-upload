let _ = require('lodash')
let chalk = require('chalk')
let express = require('express')

let server = null
let router = express.Router()

// 合法的http请求method
const REG_VALID_METHOD = /^(get|post)\s+/i
// 合法的路由pattern
const REG_VALID_PATTERN = /^(get|post)\s+\/([\w\d\/]*(\?\$[\w\d]+(\&\$[\w\d]+)*)*)*[\w\d\/]$/i
// 匹配url参数正则
const REG_URL_PARAMTERS = /\?\$[\w\d]+(\&\$[\w\d]+)*[\w\d]+$/i
// url query条目正则
const REG_URL_QUERY_ITEM = /\$[\w\d]+/g

module.exports = function (app) {
  server = app
  return function (options) {
    if (!options || !_.isPlainObject(options)) {
      console.log(chalk.red('Mock: invalid parameters'))
      process.exit()
    }
    resolve(options)
  }
}

let resolve = function (options) {
  for (let key in options) {
    excute(key, options[key])
  }
  server.use(router)
}

let excute = function (pattern, response) {
  if (!REG_VALID_PATTERN.test(pattern)) {
    console.log(chalk.red('Mock: invalid routes config'))
    process.exit()
  }
  // 滤出请求方法类型
  let method = _.lowerCase(_.trim(REG_VALID_METHOD.exec(pattern)[0]))
  // 滤出url规则
  let urlPattern = _.trim(_.last(pattern.split(REG_VALID_METHOD)))

  let api = ''
  let queries = []

  if (REG_URL_PARAMTERS.test(urlPattern)) {
    api = urlPattern.replace(REG_URL_PARAMTERS, '')
    let _item = REG_URL_QUERY_ITEM.exec(urlPattern)
    while (_item) {
      queries.push(_item[0].replace('$', ''))
      _item = REG_URL_QUERY_ITEM.exec(urlPattern)
    }
  } else {
    api = urlPattern
  }
  console.log('queries', queries)
  route({
    method,
    api,
    queries,
    response
  })
}

let route = function (options) {
  let method = options.method
  let api = options.api
  let queries = options.queries
  let response = options.response

  switch (method) {
    case 'get':
      route_get(api, queries, response)
      break
    case 'post':
      route_post(api, queries, response)
      break
    default:
      break
  }
}

let route_get = function (api, queries, response) {
  let res_ok = response.ok || {
    code: 100,
    msg: '请求成功'
  }
  let res_fail = response.fail || {
    code: 200,
    msg: '请求失败'
  }

  router.get(api, (req, res) => {
    let ok = true

    // 校验query是否完整
    queries && queries.length !== 0 && (() => {
      for (let i = 0, len = queries.length; i < len; i++) {
        if (!req.query[queries[i]]) {
          ok = false
          res_fail.msg = '参数不完整'
          return
        }
      }
    })()
    if (ok) {
      req.query.callback && res.jsonp(res_ok) || res.json(res_ok)
    } else {
      req.query.callback && res.jsonp(res_fail) || res.json(res_fail)
    }
  })
}

let route_post = function (api, queries, response) {
  let res_ok = response.ok || {
    code: 100,
    msg: '请求成功'
  }
  let res_fail = response.fail || {
    code: 200,
    msg: '请求失败'
  }

  router.post(api, (req, res) => {
    let ok = true
    // 校验query是否完整
    queries && queries.length !== 0 && (() => {
      for (let i = 0, len = queries.length; i < len; i++) {
        if (!req.body[queries[i]]) {
          ok = false
          res_fail.msg = '参数不完整'
          return
        }
      }
    })()
    if (ok) {
      req.query.callback && res.jsonp(res_ok) || res.json(res_ok)
    } else {
      req.query.callback && res.jsonp(res_fail) || res.json(res_fail)
    }
  })
}
