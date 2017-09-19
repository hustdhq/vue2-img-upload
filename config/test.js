var path = require('path')
//[id] 被 chunk 的 id 替换。
//[name] 被 chunk 的 name 替换（或者，在 chunk 没有 name 时使用 id 替换）。
//[hash] 被 compilation 生命周期的 hash 替换。
//[chunkhash] 被 chunk 的 hash 替换。
//注意 src/assets 中的资源webpack会当做模块解析 static中的资源webpack只是简单的复制

// 测试环境配置 
// 注意！咱们测试环境实际上指的是打包编译部署到测试环境的文件，与vue-cli期待的测试环境(unit | e2e)不一样
module.exports = {
  env: {
    NODE_ENV: '"test"' //输出的环境变量名
  },
  assetsRoot: path.resolve(__dirname, '../dist'), //webpack输出的目标文件夹路径,必须是本地文件系统上的绝对路径
  assetsSubDirectory: 'static', //webpack编译输出的二级文件夹,假如build.assetsRoot参数是/path/to/dist，build.assetsSubDirectory 参数是 static, 那么所以webpack资源会被编译到path/to/dist/static目录
  assetsPublicPath: '/', //webpack编译输出的线上发布路径,这个是通过http服务器运行的url路径,最终生成的路径会和assetsSubDirectory结合
  filename: 'js/[name].[chunkhash].js', //编译输出js文件名格式
  chunkFilename: 'js/[name].[chunkhash].js', //没有指定输出名的js文件输出的文件名格式
  styleFilename: 'css/[name].[contenthash].css', //输出css文件名格式
  imgname: 'img/[name].[hash:7].[ext]', // [src/assets/**/*] 中图片在文件中引入的名字以及生成在dist中的名字
  fontname: 'fonts/[name].[hash:7].[ext]', // [src/assets/**/*] 字体文件在文件中引入的名字以及生成在dist中的名字
  htmlMinify: { //编译生成html时的配置选项，详见https://github.com/kangax/html-minifier#options-quick-reference
    removeComments: true //移除html中注释
  },
  vendor: [],//可自由配置vendor要包含的模块，默认引入所有从node_modules文件夹中引入使用的模块
  manifest: false,//manifest是提取vendor中的运行时代码，防止在vendor中打包模块不变，但是每次重新打包生成新的hash值，默认不生成manifest，以减少网络请求链接数
  productionSourceMap: true, //是否生成sourcemap
  bundleAnalyzerReport: process.env.npm_config_report //运行`npm run build test --report` 在打包结束后可在浏览器查看打包分析报告，设置为true或者false，可总是自动开启或关闭该功能
}
