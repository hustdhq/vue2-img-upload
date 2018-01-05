<template>
  <div id="app">
    <img-upload :image-preview-list="images"
                :on-success="onSuccess"
                :on-error="onError"
                :on-complete="onComplete"
                :before-upload="beforeUpload"
                :max="9"
                :url="url"
                :extra-data="extraData"
                :is-preview="true"
                :is-clip="true"
                :clip-data="{width: 290,height: 290,rate: 3,background: '#fff'}"></img-upload>
    <!--<img-upload :image-preview-list="images2" :upload-cb="uploadCb" :max="9" url="http://www.baidu.com" :is-preview="true"></img-upload>-->
    <!--<img-upload :image-preview-list="images3" :upload-cb="uploadCb" :max="9" url="http://www.baidu.com" :is-preview="true"></img-upload>-->

    <p>后端接口地址：<input type="text" v-model="url"></p>

    <p>————————修改日志————————</p>
    <p>2018-01-04：新增图片裁剪的功能(只支持单张上传)</p>
    <p>2017-09-19：优化onSuccess钩子，添加onError、onComplete、beforeUpload等钩子</p>
    <p>2017-09-19：修复连续选取同一文件时不触发onchange事件的bug</p>
    <p>2017-09-18：迁移至vue2.0</p>
    <p>2016-12-05：添加图片点击预览大图功能</p>
    <p>2016-12-02：支持由外部传入的图片数组</p>
    <p>2016-11-30：发出请求后的回调处理改为由外部传入回调函数</p>
    <p>2016-11-27：v1.0，支持前端压缩、IOS图片方向修复、选择多张图片等功能</p>
    <p>confluence地址：<a href="http://confluence.daojia-inc.com/pages/viewpage.action?pageId=32675115" target="_blank">html5移动端上传图片的解决方案及vue实现（v1.0）</a></p>
  </div>
</template>

<script>
import ImgUpload from './components/ImgUpload.vue'

export default {
  name: 'app',
  data() {
    return {
      url: 'https://comment-dop79.djtest.cn/comment/api/upload',
      images: [],
      images2: [],
      images3: [],
      extraData: {

      }
    }
  },
  methods: {
    /*uploadCb(data, img) {
      if(img.isUploading === true) {
        img.isUploading = false
        console.log(data)
        if(data.code == 0) {
          let pic = data.data.pic[0]
          if(pic.code == 1) {
            img.url = pic.url
          } else {
            img.isError = true
          }
        } else {
          img.isError = true
          alert(data.codeMsg)
        }
      }
    }*/

    onSuccess(data, img, list) {
      if (data.code == 0) {
          console.log(123)
      } else {
//          return Promise.reject(data)
          return false
      }
    },

    onError(data, img, list) {
      alert('上传失败')
    },

    onComplete(data, img, list) {
      alert('上传完成')
    },

    beforeUpload(file) {
      console.log(file)
      if(file.size > 1024*1024*10) {
        alert('上传图片不得大于10M！')
        return false
      }
    }
  },
  components: {
    ImgUpload
  }
}
</script>

<style>
  p{
    font-size: 14px;
    color: #666;
  }
  a{
    color: #666;
  }
  input{
    width: 200px;
    outline: 1px solid #dfdfdf;
  }
</style>
