var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'
var env = config[buildEnv]['env']
var entry = {}
var htmlBundleConcat = ['vendor']
var CommonsChunkConfig = {
  name: 'vendor',
  minChunks: function (module, count) {
    // any required modules inside node_modules are extracted to vendor
    return (
      module.resource &&
      /\.js$/.test(module.resource) &&
      module.resource.indexOf(
        path.join(__dirname, '../node_modules')
      ) === 0
    )
  }
}

if (config[buildEnv].vendor && config[buildEnv].vendor.length > 0) {
  entry = {
    vendor: config[buildEnv].vendor
  }
  CommonsChunkConfig = {
    name: 'vendor',
    minChunks: Infinity
  }
}

var webpackConfig = merge(baseWebpackConfig, {
  entry: entry,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config[buildEnv].productionSourceMap,
      extract: true
    })
  },
  devtool: config[buildEnv].productionSourceMap ? '#source-map' : false,
  output: {
    path: config[buildEnv].assetsRoot,
    filename: utils.assetsPath(config[buildEnv]['filename']),
    chunkFilename: utils.assetsPath(config[buildEnv]['chunkFilename'])
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: config[buildEnv].productionSourceMap
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath(config[buildEnv]['styleFilename'])
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: config[buildEnv].index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: false,
    //     removeAttributeQuotes: false
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),
    // split vendor js into its own file
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    // copy custom static assets

  ]
})

if (config[buildEnv].manifest) {
  htmlBundleConcat = ['vendor', 'manifest']
}
//多入口配置
for (var key in config.pages) {
  var page = config.pages[key]
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: page.filename,
      template: page.template,
      chunks: [].concat(page.chunks).concat(htmlBundleConcat),
      inject: page.inject,
      minify: typeof (config[buildEnv].htmlMinify) === 'object' ? Object.assign({}, config[buildEnv].htmlMinify) : {},
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })
  )
}
//vendor配置
webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin(CommonsChunkConfig));

if (config[buildEnv].manifest) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  );
}

webpackConfig.plugins.push(
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: config[buildEnv].assetsSubDirectory,
      ignore: ['.*']
    }
  ])
);

if (config[buildEnv].productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config[buildEnv].productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config[buildEnv].bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
