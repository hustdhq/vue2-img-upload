require('./check-versions')()
var buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'
process.env.NODE_ENV = buildEnv === 'test' ? 'test' : 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.build.conf')
var buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'

var spinner = ora('building for ' + chalk.green(buildEnv) + ' production...')
spinner.start()

rm(path.join(config[buildEnv]['assetsRoot'], config[buildEnv]['assetsSubDirectory']), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
  })
})
