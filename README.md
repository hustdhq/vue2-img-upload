# vue2-img-upload

> An image upload component based on Vue2.0 (For mobile terminal)

## 简介

> 基于Vue2.0的移动端图片上传组件

## Demo

[demo地址](http://static.djtest.cn/assets/other/vue2-img-upload-demo/index.html)

## 主要功能点
- 移动端上传图片
- 前端压缩
- 多张上传（IOS完美支持，安卓视机型而定）
- 滑动预览（基于Swiper.js）
- 纠正IOS下图片方向错误（基于exif.js）
- ...（版本迭代中）

## 使用方式

```js
// install
npm install vue2-img-upload --save-dev

// register
import ImgUpload from vue2-img-upload
Vue.component('ImgUpload', ImgUpload)

// also you can...
new Vue({
  // ...
  components: {
    ImgUpload
  }
})

// use it in template
<img-upload url="your interface url" :on-success="onSuccess"></img-upload>
```

## API Document

|key|description|default|options|required|
|:---|---|---|---|---|
| `url`|后端接口地址|-|`String`|yes
|`image-preview-list`|图片列表(所有操作均在此数组上进行)|`[]`|`Array`
|`max`|图片最大张数|`6`|`Number`|
|`name`|自定义图片字段名|`image`|`String`|
|`is-preview`|是否开启点击预览大图功能|`true`|`Boolean`|
|`extra-data`|上传时附带的额外参数|`{}`|`Object`|
|`onSuccess`| 上传成功时的回调 |`{}`|`function(data, img, list)`|
|`onError`| 上传失败时的回调 |-|`function(data, img, list)`|
| `onComplete`|上传完成时的回调（会在成功或失败回调之后被调用）|-|`function(data, img, list)`|
| `beforeUpload`|上传之前的钩子，每一张图片上传时都会调用，若返回`false`则该图片停止上传|-|`function(file)`|

## Demo Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# 线上环境构建
npm run build prod

# 测试环境构建（如果build后不加参数默认为test）
npm run build test

# build for production and view the bundle analyzer report
npm run build --report




