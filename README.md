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
- 纠正IOS下照片方向错误（基于exif.js）
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

## 注意事项
- 不兼容vue1.0版本
- ajax模块使用的是vue-resource@1.2.0，因此您需要在项目中引入vue-resource的1.2.0+版本，以后会根据需求考虑支持用户自定义ajax模块，或内置ajax模块
- 您可能需要在某些情况下处理跨域问题，这里建议使用CORS方案
- 条件所限，没有做太多机型的兼容性测试，如果您在使用中发现bug或兼容性问题，欢迎提issue给我

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

## API Examples

```js
<img-upload :image-preview-list="images"
            :on-success="onSuccess"
            :on-error="onError"
            :on-complete="onComplete"
            :before-upload="beforeUpload"
            :max="9"
            :url="url"
            :extra-data="extraData"
            :is-preview="true">
</img-upload>

export default {
    data() {
        return {
            // 可以在组件加载前预先放置图片（例如在一些编辑的场景），若没有，则可设为空数组
            // 注意：每张图片拥有4个属性：data(用于预览图的展示)、url(用于储存后台返回的图片地址)、isUploading(用于正在上传蒙层的展示)、isError(用于上传失败蒙层的展示)
            // 其中isUploading和isError由组件自行控制。您也可以在钩子中手动控制
            images: [{data: 'http://myserver.com/1.jpg'}, {data: 'http://myserver.com/2.jpg'}],

            // 后台接口地址，后台接收到的是文件的二进制流。注意：由于请求方法为POST，您可能需要用CORS等手段处理跨域问题
            url: 'https://my.server.com/uploadimg',

            // 您可以在formData内添加一些额外数据。注意：由于本组件中每张图片是单独上传的，因此每张图片的请求中都会携带该数据
            extraData: {desc: '这是图片描述'}
        }
    },

    methods: {
        onSuccess(data, img, list) {
            console.log(data)
            if (data.code == 0) {
                img.url = data.url
            } else {
                // 在请求的成功回调中，您可以通过返回`false`或一个`执行了reject()的Promise对象`来手动跳到失败回调（例如后台返回错误码等情况）
                return Promise.reject(data)
                // or
                return false
            }
        },

        onError(data, img, list) {
            // 若为请求失败，则data为空；若为返回的数据错误，则data为返回的数据
            alert('上传失败')
        },

        onComplete(data, img, list) {
            // 无论成功还是失败都会执行，执行时机为onSuccess或onError之后
            alert('上传完成')
        },

        beforeUpload(file) {
            // 每张图片上传前都会执行，若返回false，则阻止此次上传
            if(file.size > 1024*1024*10) {
                alert('上传图片不得大于10M！')
                return false
            }
        }
    }
}
```

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




