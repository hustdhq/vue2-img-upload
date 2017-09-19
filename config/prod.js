var path = require('path')

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  filename: 'js/[name].js',
  chunkFilename: 'js/[name].js',
  styleFilename: 'css/[name].css',
  imgname: 'img/[name].[hash:7].[ext]',
  fontname: 'fonts/[name].[hash:7].[ext]',
  htmlMinify: {
    removeComments: true
  },
  vendor: [],
  manifest: false,
  productionSourceMap: false,
  bundleAnalyzerReport: process.env.npm_config_report
}
