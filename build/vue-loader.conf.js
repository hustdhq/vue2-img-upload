var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production' ||  process.env.NODE_ENV === 'test'
var buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config[buildEnv].productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  })
}
