<template>
  <div>
    <div class="evaluateImgCon">

      <section class="evaluateImgItem"
               :class="{uploading: img.isUploading, error: img.isError}"
               v-for="(img, index) in imagePreviewList"
               track-by="$index">
        <img alt="" class="evaluateImg" :src="img.data" @click="imgSwiper(index)"/>
        <div class="uploading-box">上传中...</div>
        <div class="error-box">上传失败</div>
        <div class="cover" v-if="index === 0">封面</div>
        <span class="delIcon" @click="delImage(index, img)"></span>
      </section>

      <div class="evaluateUploadImg" @click="openUploadPop($event)" v-if="imagePreviewList.length < max">
        <span class="uploadIcon"></span>
        <input type="file" class="uploadFile" accept="image/*" capture="camera" ref="upload"
               @change="uploadImg" multiple="multiple">
      </div>
    </div>

    <div class="swiper-layout" v-show="isSwiper">
      <div class="swiper-container" @click="hideSwiper">
        <div class="swiper-guide">
          <span>{{currSwiperIndex}}</span>/<span>{{imagePreviewList.length}}</span>
        </div>
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(img, index) in imagePreviewList">
            <img :src="img.data" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  //动态加载JS
  function loadJSFile(src, cb) {
    let script = document.createElement("script")
    script.setAttribute("type", "text/javascript")
    script.onload = () => {
      cb && cb()
    }
    script.setAttribute("src", src)
    document.getElementsByTagName("head").item(0).appendChild(script)
  }
  //动态加载CSS
  function loadCSSFile(src, cb) {
    let style = document.createElement("link")
    style.setAttribute("rel", "stylesheet")
    style.onload = () => {
      cb && cb()
    }
    style.setAttribute("href", src)
    document.getElementsByTagName("head").item(0).appendChild(style)
  }
  export default {
    props: {
      // 图片最大张数
      max: {
        type: Number,
        default: 6
      },

      // 上传图片的接口地址
      url: {
        type: String,
        require: true
      },

      // 图片列表
      imagePreviewList: {
        type: Array,
        default() {
          return []
        }
      },

      beforeUpload: {
        type: Function
      },

      // 上传完成时的回调（无论成功或失败）
      onComplete: {
        type: Function
      },

      // 上传成功后的回调
      onSuccess: {
        type: Function
      },

      // 上传失败后的回调
      onError: {
        type: Function
      },

      // 是否开启点击预览大图功能
      isPreview: {
        type: Boolean,
        default: true
      },

      // 图片字段命名，默认为image
      name: {
        type: String,
        default: 'image'
      },

      // 图片上传时的额外信息
      extraData: {
        type: Object
      }
    },

    data(){
      return {
        isSwiper: false,
        currSwiperIndex: 1
      }
    },

    created() {
      if (this.isPreview || 'function' !== typeof Swiper) {
        loadCSSFile('//static.daojia.com/assets/common/css/swiper-3.4.0.min.css')
        loadJSFile('//static.daojia.com/assets/common/js/swiper-3.4.0.min.js', () => {
          console.log('swiper.js加载成功')
        })
      }

      loadJSFile('//static.daojia.com/assets/common/js/exif.js', () => {
        console.log('加载EXIF模块成功')
      })

      loadJSFile('//static.daojia.com/assets/common/js/toBlob.js', () => {
        console.log('加载toBlob模块成功')
      })
    },

    methods: {
      //上传图片点击事件
      openUploadPop() {
        // 防止选取同一个文件时不触发onchange事件
        this.$refs.upload.value = ''
        this.$refs.upload.click()
      },

      // 解析图片
      analyzeImg(originImg, cb) {
        let _this = this

        if (originImg) {
          if (!/image\/\w+/.test(originImg.type)) {
            // alert('请选择png、jpg、jpeg格式图片上传')
            return false
          }

          try {
            let reader = new FileReader()
            reader.readAsDataURL(originImg)

            reader.onload = function (e) {
//              let result = e.target.result
              let img = new Image()
              img.src = e.target.result

              if (img.complete) {
                callback()
              } else {
                img.onload = callback
              }

              function callback() {
                _this.compress(img, function (blob, data) {
                  // console.log(blob.size)
                  cb && cb(blob, data)
                })
              }
            }
          } catch (e) {
            alert('不支持h5上传')
            return false
          }
        } else {
          return false
        }
        return true
      },

      /**
       * 压缩图片
       * @param img
       * @param cb
       * cb中传入两个参数：blob、data，其中blob为图片的二进制字符串，data为图片的base64字符串
       */
      compress(img, cb) {
        let canvas = document.createElement("canvas")    // 用于压缩图片的canvas
        let ctx = canvas.getContext('2d')
        let tCanvas = document.createElement("canvas")  // 瓦片canvas
        let tctx = tCanvas.getContext("2d")
        let rCanvas = document.createElement("canvas")  // 旋转canvas
        let rctx = rCanvas.getContext("2d")

        let initSize = img.src.length
        let width = img.width
        let height = img.height
        let count, ratio

        let orient = this.getOrientation(img)
        console.log('orient:' + orient)

        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio)
          width /= ratio
          height /= ratio
        } else {
          ratio = 1
        }

        canvas.width = rCanvas.width = width
        canvas.height = rCanvas.height = height
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        //如果图片像素大于100万则使用瓦片绘制
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1)       // 计算要分成多少块瓦片
          var nw = ~~(width / count)             // 计算每块瓦片的宽和高
          var nh = ~~(height / count)

          tCanvas.width = nw
          tCanvas.height = nh

          for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height)
        }

        //解决IOS下图片方向不正确的bug
        if (orient && orient != 1) {
          rctx.drawImage(canvas, 0, 0, width, height)
          ctx.clearRect(0, 0, width, height)
          ctx.save()  //保存状态
          ctx.translate(canvas.width / 2, canvas.height / 2)  //设置旋转的中心点
          switch (orient) {
            case 6:
              canvas.width = height
              canvas.height = width
              ctx.rotate(90 * Math.PI / 180)  //把画布旋转90度
              ctx.drawImage(rCanvas, 0, -height)
              break
            case 3:
              ctx.rotate(180 * Math.PI / 180)  //把画布旋转180度
              ctx.drawImage(rCanvas, -width / 2, -height / 2)
              break
            case 8:
              canvas.width = height
              canvas.height = width
              ctx.rotate(270 * Math.PI / 180)  //把画布旋转270度
              ctx.drawImage(rCanvas, -width, 0)
              break
          }
          ctx.restore()   //恢复状态
        }

        // 根据压缩比进行压缩 0.8
        let imagData = canvas.toDataURL('image/jpeg', 0.8)
        canvas.toBlob((blob) => {
          cb && cb(blob, imagData)
        }, 'image/jpeg', 0.8)

        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
        // return imagData
      },

      //上传图片
      uploadImg(e) {
        for (let i = 0; i < e.target.files.length; i++) {
          // 若用户传入了beforeUpload，且返回值为false，则阻止该图片上传
          if(!this.beforeUpload || this.beforeUpload(e.target.files[i]) !== false) {
            if (e.target.files[i] && /image\/\w+/.test(e.target.files[i].type)) {
              let curImg = {
                data: '',
                url: '',
                isUploading: true,
                isError: false
              }
              if (this.imagePreviewList.length < this.max) {
                this.imagePreviewList.push(curImg)
                this.analyzeImg(e.target.files[i], (file, data) => {
                  curImg.data = data
                  let curIndex = this.imagePreviewList.length - 1

                  let formData = new FormData
                  formData.append(this.name, file)
                  // 添加额外数据
                  for (let key in this.extraData) {
                    formData.append(key, this.extraData[key])
                  }

                  // 向后台发送图片数据
                  let _data = null
                  this.$http.post(this.url, formData).then((res) => {
                    _data = res.body
                    curImg.isUploading = false
                    // 请求发送成功后执行onSuccess
                    const _result = (this.onSuccess && this.onSuccess(_data, curImg, this.imagePreviewList))
                    if (_result === false) {
                      // 若外部回调返回值为false，则进入失败回调
                      return Promise.reject(_data)
                    } else {
                      // 若返回值不为false，则根据用户返回的值判断是否进入失败回调
                      return _result
                    }
                  }).catch((res) => {
                    curImg.isError = true
                    curImg.isUploading = false
                    // 执行失败回调onError
                    this.onError && this.onError(res, curImg, this.imagePreviewList)
                  }).finally(() => {
                    // 执行完成回调onComplete
                    this.onComplete && this.onComplete(_data, curImg, this.imagePreviewList)
                  })
                })
              }
            }
          }
        }
      },

      //获取图片的Orientation属性（依赖exif.js）
      getOrientation(img) {
        let orient = null
        if ('function' == typeof EXIF) {
          EXIF.getData(img, function () {
            orient = EXIF.getTag(this, 'Orientation')
          })
          return orient
        } else {
          console.log('未加载EXIF模块')
        }
      },

      //删除图片
      delImage(index, img) {
        if (img.isUploading) {
          img.isUploading = false
        }
        this.imagePreviewList.splice(index, 1)
      },

      //图片预览的点击事件
      imgSwiper(index) {
        this.createSwiper(index)
      },

      //创建swiper实例
      createSwiper(index) {
        this.isSwiper = true
//        this.$dispatch('hideBtn')
        this.currSwiperIndex = index + 1
        let _this = this
        let mySwiper = new Swiper('.swiper-container', {
          direction: 'horizontal',
          initialSlide: index,
          observer: true,
          observeParents: true,
          onTransitionEnd(swiper) {
            _this.currSwiperIndex = swiper.activeIndex + 1
          }
        })
      },

      //隐藏swiper
      hideSwiper() {
        this.isSwiper = false
//        this.$dispatch('showBtn')
      }
    },

    components: {}
  }
</script>

<style scoped>
  .evaluateImgCon {
    padding: 15px 0;
    margin: 0 -5px;
    font-size: 0;

    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;

    -webkit-box-lines: multiple;
    -webkit-flex-wrap: wrap;
    -moz-flex-wrap: wrap;
    flex-wrap: wrap;

    flex-direction: row;

    justify-content: flex-start;

    /*margin-bottom: 95px;*/
  }

  .evaluateImgItem {
    position: relative;
    margin: 0 5px;
    margin-bottom: 11px;
    display: inline-block;
  }

  .evaluateImgItem .uploading-box,
  .evaluateImgItem .error-box {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 78px;
    height: 78px;
    line-height: 78px;
    background-color: rgba(0, 0, 0, .6);
    color: #fff;
    text-align: center;
    font-size: 14px;
  }

  .evaluateImgItem.uploading .uploading-box {
    display: block;
  }

  .evaluateImgItem.error .error-box {
    display: block;
  }

  .evaluateImgItem .cover {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    background-color: rgba(0, 0, 0, .4);
    color: #fff;
  }

  /*.evaluateImgItem:nth-child(4n) {
      margin-right: 0;
  }*/
  .evaluateImg {
    width: 78px;
    height: 78px;
  }

  .delIcon {
    position: absolute;
    width: 19px;
    height: 19px;
    background: #E6454A;
    border: 1px solid #fff;
    border-radius: 50%;
    top: -6px;
    right: -7.5px;
  }

  .delIcon::before {
    position: absolute;
    width: 30px;
    height: 30px;
    content: '';
    top: -4px;
    left: -6px;
    z-index: 99;
  }

  .delIcon::after {
    position: absolute;
    width: 9px;
    height: 1px;
    content: '';
    background: #FFFFFF;
    top: 7.5px;
    left: 4px;
  }

  .evaluateUploadImg {
    position: relative;
    width: 78px;
    height: 78px;
    margin: 0 5px;
    background: #f1f1f1;
    border: 1px solid #dfdfdf;
    display: inline-block;
  }

  .uploadIcon {
    position: absolute;
    height: 27px;
    width: 29px;
    top: 25.5px;
    left: 24.5px;
    background: url(data:image/png;base64,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) 0 0 no-repeat;
    background-size: 100% 100%;
    display: block;
  }

  .tpls,
  .uploadFile {
    height: 0;
    width: 0;
    visibility: hidden;
    overflow: hidden;
  }

  .swiper-layout {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    z-index: 99;
  }

  .swiper-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .swiper-container .swiper-slide {
    position: relative;
  }

  .swiper-container .swiper-slide img {
    width: 100%;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .swiper-container .swiper-guide {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: rgba(0, 0, 0, .5);
    text-align: center;
    font-size: 14px;
    color: #fff;
    z-index: 999;
  }

</style>
