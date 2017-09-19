var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var SpritesmithPlugin = require('webpack-spritesmith')
var scssTemplate = require('./sprites/scss.js')
var cssTemplate = require('./sprites/css.js')
var buildEnv = JSON.parse(process.env.npm_config_argv).remain[0] || 'test'
var eslintRule = {
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter')
  }
};
var exportsEslintRule = config.commonConfig.useEslint ? eslintRule : {}
var mutiEntry = {}
var spriteConfig = config.commonConfig.spriteConfig || false

for (var key in config.pages) {
  mutiEntry[key] = config.pages[key].src
}

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
  entry: mutiEntry,
  output: {
    path: config[buildEnv]['assetsRoot'],
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
      ? config[buildEnv]['assetsPublicPath']
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: ['node_modules', path.resolve(__dirname, '../src/style/sprite')],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      exportsEslintRule,
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: config.commonConfig.img2base64Limit,
          name: utils.assetsPath(config[buildEnv]['imgname'])
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: config.commonConfig.font2base64Limit,
          name: utils.assetsPath(config[buildEnv]['fontname'])
        }
      }
    ]
  },
  plugins: []
}

// 配置sprite插件
if (config.commonConfig.useSprite && spriteConfig) {
  var spriteType = { unit: spriteConfig.unit, scale: spriteConfig.scale }
  var cssPath = []
  if (spriteConfig.target.css) {
    cssPath.push([path.resolve(__dirname, '../' + spriteConfig.target.css), {
      format: 'css_template'
    }]);
  }
  if (spriteConfig.target.scss) {
    cssPath.push([path.resolve(__dirname, '../' + spriteConfig.target.scss), {
      format: 'scss_template'
    }]);
  }
  webpackConfig.plugins.push(new SpritesmithPlugin({
    src: {
      cwd: path.resolve(__dirname, '../' + spriteConfig.src.path),
      glob: spriteConfig.src.glob
    },
    target: {
      image: path.resolve(__dirname, '../' + spriteConfig.target.image),
      css: cssPath
    },
    apiOptions: {
      cssImageRef: spriteConfig.cssImageRef
    },
    spritesmithOptions: {
      algorithm: 'top-down',
      padding: spriteConfig.padding || 10
    },
    customTemplates: {
      'css_template': cssTemplate(spriteType),
      'scss_template': scssTemplate(spriteType)
    }
  })
  )
}

module.exports = webpackConfig
