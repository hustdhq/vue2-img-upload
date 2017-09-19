var path = require('path')
var prod = require('./prod.js')
var test = require('./test.js')
var dev = require('./dev.js')

module.exports = {
  //多入口配置
  pages: {
    'my-index': {
      filename: 'index.html', //入口html文件
      template: 'index.html', //html文件所引用的模板[多个入口可以共用一个模板]
      src: './src/main.js', //入口js
      inject: 'body', //js在生成html中的注入位置，默认为body标签
      chunks: ['my-index'] //打包后的文件名，为保持结构清晰，与pages的key保持一致
    }
    // ,
    // 'other': {
    //   filename: 'other.html',
    //   template: 'other.html',
    //   src: './src/other.js',
    //   inject: 'body',
    //   chunks: ['other']
    // }
  },
  //通用配置
  commonConfig: {
    useEslint: false,  //是否使用eslint
    img2base64Limit: 1, //图片转换成base64编码的大小上限，单位字节
    font2base64Limit: 1, //字体文件转换成base64编码的大小上限，单位字节
    useSprite: true, // 雪碧图编译很耗时，如果不需要雪碧图功能请将useSprite置为false
    spriteConfig: { // 雪碧图配置
      src: {
        path: 'src/assets/icons/', //图片存放的文件夹路径
        glob: '*.png' //文件夹内所有的png图片都会被合成雪碧图(支持正则表达式)
      },
      target: {
        image: 'src/style/sprite/sprite.png', // 生成的雪碧图存放路径
        css: 'src/style/sprite/sprite.css', //生成的css文件存放路径
        scss: 'src/style/sprite/sprite.scss' //生成的scss文件存放路径
      },
      padding: 10,  // icons padding
      cssImageRef: '~sprite.png', // 生成图片相对css文件内引用的路径,上线时要把此处替换成雪碧图的线上绝对地址
      unit: 'px',//生成雪碧图的单位,可设置成rem
      scale: 1//雪碧图相对于原来图片大小的缩放比例，该值为分母
    }
  },
  prod: prod,
  test: test,
  dev: dev
}
