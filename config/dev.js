var path = require('path')

module.exports = {
  env: {
    NODE_ENV: '"development"' //输出的环境变量名
  },
  port: 8080, //dev-server监听的端口
  autoOpenBrowser: true, //启动dev-server之后是否自动打开浏览器
  assetsSubDirectory: 'static', //webpack编译输出的二级文件夹
  assetsPublicPath: '/', // webpack编译输出的发布路径
  cssSourceMap: false, //是否开启 cssSourceMap
  proxyTable: { //需要 proxyTable 代理的接口（可跨域）
    // '/api/**': {
    //   target: 'https://bj.daojia.com/',//代理地址
    //   changeOrigin: true
    // }
  }
}
