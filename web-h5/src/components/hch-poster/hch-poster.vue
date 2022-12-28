<!--
 * @Description: 生成海报组件
 * @Version: 1.0.0
 * @Autor: hch
 * @Date: 2020-08-07 14:48:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-31 18:11:35
 * 保存海报按钮和关闭按钮 在html代码中写出来 绑定点击方法然后透明 再用canvas 覆盖
-->

<template>
  <!--  :style="'width:' + system.w + 'px; height:' + system.h + 'px;'"-->
  <view
    v-if="canvasShow"
    class="canvas-content of-a flex fd-c jc-c ai-c"

  >
    <!-- 遮罩层 -->
    <view class="canvas-mask"/>
    <canvas
      ref="canvas"
      class="canvas"
      @tap.stop=""
      canvas-id="myCanvas"
      id="myCanvas"
      :height="406"
      :style="'width:' + 275  + 'px; height:' + 406  + 'px;'"
      :width="275"
    ></canvas>
    <!--    <view class="button-wrapper flex jc-sa ai-c fw-w" :style="{bottom:buttonHeight}">-->
    <view class="button-wrapper flex jc-sa ai-c fw-w">
      <!-- 保存海报按钮 -->
      <!-- #ifndef MP-QQ -->
      <!-- cover-view 标签qq小程序有问题 -->
      <cover-view class="w-50 flex jc-c ai-c fd-c">
        <view class="save-btn flex jc-c ai-c">
          <image src="../../static/img/download.svg" @tap.stop="handleSaveCanvasImage"/>
        </view>
        <view class="fs-24 mt-2 button-color">下载图片</view>
      </cover-view>
      <cover-view class="w-50 flex jc-c ai-c fd-c">
        <view class="save-btn flex jc-c ai-c">
          <image src="../../static/img/copy.svg" @tap.stop="handleCanvasCancel"/>
        </view>
        <view class="fs-24 mt-2 button-color">复制链接</view>
      </cover-view>
      <!-- #endif -->
    </view>
    <view :style="{top:closeTop,left:closeRight}" class="close-btn flex jc-c ai-c"
          @click="canvasShow = false,$emit('close','')">
      <image class="close-img" src="../../static/img/close-icon.svg"/>
    </view>
    <!--    <cover-view class="pos-btn w-50 flex jc-c ai-c" @click="canvasShow = false">-->
    <!--      <view class="close-btn flex jc-c ai-c">-->
    <!--        <image src="../../static/img/close-icon.svg"/>-->
    <!--      </view>-->
    <!--    </cover-view>-->
  </view>
</template>

<script>

import {drawSquarePic, drawTextReturnH, getSystem} from './utils'

export default {
  data() {
    return {
      system: {},
      canvasShow: false,
      tempFile: '',
      needTransform: false,
      closeTop: '0',
      closeRight: '0'
    }
  },
  props: {
    posterData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    text: {
      type: String,
      default: location.href
    },
  },
  computed: {
    scale() {
      let system = uni.getSystemInfoSync()
      if (system.windowWidth > 768) {
        return {x: 1, y: 1}
      }
      let x = system.windowWidth / 375 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
      let y = system.windowHeight / 500 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
      return {x, y}
    },

    buttonHeight() {
      let data = this.posterData.poster
      let system = this.system
      return (this.system.h - 500 - 70) / 3 + 'px'
    },
    /**
     * @description: 计算海报背景数据
     * @param {*}
     * @return {*}
     * @author: hch
     */
    poster() {
      let data = this.posterData
      return data.poster
    },
    /**
     * @description: 计算海报头部主图
     * @param {*}
     * @return {*}
     * @author: hch
     */
    mainImg() {
      let data = this.posterData
      return data.mainImg
    },
    /**
     * @description: 计算头像
     * @param {*}
     * @return {*}
     * @author: hch
     */
    /**
     * @description: 计算海报标题
     * @param {*}
     * @return {*}
     * @author: hch
     */
    title() {
      let data = this.posterData
      return data.title
    },
    merchant() {
      let data = this.posterData
      return data.merchant
    },
    price() {
      let data = this.posterData
      return data.price
    },
    /**
     * @description: 计算小程序码
     * @param {*}
     * @return {*}
     * @author: hch
     */
    codeImg() {
      let data = this.posterData
      return data.codeImg
    }
  },

  created() {
    // 获取设备信息
    this.system = getSystem()
    let system = uni.getSystemInfoSync()
    this.closeTop = (system.windowBottom + system.windowHeight + system.windowTop) / 2 - 406 / 2 - 30 + 'px'
    this.closeRight = system.windowWidth / 2 + 275 / 2 - 54 + 'px'
  },

  methods: {
    /**
     * @description: 展示海报
     * @param {type}
     * @return {type}
     * @author: hch
     */
    posterShow() {
      this.canvasShow = true
      this.system = getSystem()
      let system = uni.getSystemInfoSync()
      this.closeTop = (system.windowBottom + system.windowHeight + system.windowTop) / 2 - 406 / 2 - 30 + 'px'
      this.closeRight = system.windowWidth / 2 + 275 / 2 - 54 + 'px'
      this.creatPoster()
    },
    /**
     * @description: 生成海报
     * @author: hch
     */
    async creatPoster() {

      const ctx = uni.createCanvasContext('myCanvas', this)
      this.ctx = ctx

      ctx.clearRect(0, 0, 355, 510) //清空之前的海报
      ctx.draw() //清空之前的海报
      // 根据设备屏幕大小和距离屏幕上下左右距离，及圆角绘制背景
      let poster = this.poster
      let mainImg = this.mainImg
      let merchant = this.merchant
      let codeImg = this.codeImg
      let title = this.title
      let price = this.price
      // ctx.draw()
      //添加白色背景
      await drawSquarePic(ctx, poster.x, poster.y, poster.w, poster.h, 10, '', 'rgb(255,255,255)', '', false, true)

      //绘制顶部藏品图片
      await drawSquarePic(ctx, mainImg.x, mainImg.y, mainImg.w, mainImg.h, 10, mainImg.url, '', '', true)

      //绘制顶部藏品图片
      await drawSquarePic(ctx, 10, 10, 60, 23, 12, '', 'rgba(0,0,0,.3)', '',)
      await drawTextReturnH(ctx, '数字藏品', 20, 25, 200, 10, '#fff', 10, 'left', '', true)

      // 绘制标题 藏品名称 绘制文本的y位置
      drawTextReturnH(ctx, title.text, title.x, title.y + title.lineHeight - 3, title.w, title.fontSize, title.color,
        title.lineHeight, 'left', 'hide', true)

      //绘制商户头像图片
      await drawSquarePic(ctx, merchant.x, merchant.y, merchant.w, merchant.h, 8, merchant.url, '')

      // 绘制商户名称
      drawTextReturnH(ctx, merchant.text, 37, 317 + merchant.lineHeight, 100, merchant.fontSize, merchant.color,
        merchant.lineHeight,
        'left', 'hide', true)

      // 绘制价格
      // if (price?.text) drawTextReturnH(ctx, '￥' + price.text, 0, 317 + merchant.lineHeight, 100, price.fontSize,
      //   price.color,
      //   price.lineHeight,
      //   'right', 'hide', true, true)

      //绘制底部图片盒子
      await drawSquarePic(ctx, 7, 345, 260, 54, 7, '', '#f8f8f8', '', false)

      // // 绘制三街图片
      await drawSquarePic(ctx, 19, 354, 114, 36, 0, '../../static/img/share-platform.svg', '#f8f8f8')

      //绘制codeImg盒子
      await drawSquarePic(ctx, 216, 348, 49, 49, 6, '', '#fff', '', false)

      //绘制分享二维码图片
      await drawSquarePic(ctx, 218, 349, 46, 46, 0, codeImg.url, '', 'code', false)

      uni.hideLoading()
    },
    /**
     * @description: 保存到系统相册
     * @param {type}
     * @return {type}
     * @author: hch
     */
    handleSaveCanvasImage() {
      let canvas = document.querySelector('.canvas')
      // canvas.style.transform = `scale(1)`
      uni.showLoading({
        title: '保存中...'
      })
      let _this = this
      // 支付宝小程序外，其他都是用这个方法 canvasToTempFilePath
      uni.canvasToTempFilePath(
        {
          x: _this.poster.x,
          y: _this.poster.y,
          width: _this.poster.w, // 画布的宽
          height: _this.poster.h, // 画布的高
          destWidth: _this.poster.w * 5,
          destHeight: _this.poster.h * 5,
          canvasId: 'myCanvas',
          success(res) {
            uni.previewImage({
              urls: [res.tempFilePath]
            })
            uni.hideLoading()
            this.canvasShow = false
            return
            // h5 直接下载至手机
            let Url = res.tempFilePath //图片路径，也可以传值进来
            let triggerEvent = "touchstart"; //指定下载方式
            let blob = new Blob([''], {type: 'application/octet-stream'}); //二进制大型对象blob
            let url = URL.createObjectURL(blob); //创建一个字符串路径空位
            let a = document.createElement('a'); //创建一个 a 标签
            a.href = Url;  //把路径赋到a标签的href上
            //正则表达式，这里是把图片文件名分离出来。拿到文件名赋到a.download,作为文件名来使用文本
            a.download = _this.title.text || '未命名图片';
            // a.download = Url.replace(/(.*\/)*([^.]+.*)/ig, "$2").split("?")[0];
            /* let e = document.createEvent('MouseEvents');  //创建事件（MouseEvents鼠标事件）
            e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); //初始化鼠标事件（initMouseEvent已弃用）*/

            //代替方法。创建鼠标事件并初始化（后面这些参数我也不清楚，参考文档吧 https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent）
            let e = new MouseEvent('click', (true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null));
            //派遣后，它将不再执行任何操作。执行保存到本地
            a.dispatchEvent(e);
            //释放一个已经存在的路径（有创建createObjectURL就要释放revokeObjectURL）
            URL.revokeObjectURL(url);
            uni.hideLoading()
            this.canvasShow = false
          },
          fail(res) {
            uni.showToast({
              title: '保存失败，稍后再试',
              duration: 2000,
              icon: 'none'
            })
            uni.hideLoading()
          },
          complete(res) {
            console.log(res, 'complete')
          }
        }, this
      )
    },
    /**
     * @description: 取消海报
     * @param {type}
     * @return {type}
     * @author: hch
     */
    handleCanvasCancel() {
      uni.setClipboardData({
        data: this.text,
        success: () => {
          uni.$u.toast('复制成功')
          // this.canvasShow = false
          // this.$emit('cancel', true)
        }, fail: (err) => {
          console.log(err, 'copy')
        }
      });

    }
  }
}
</script>

<style lang="scss">
.pos-btn {
  position: absolute;
  z-index: 1000;
  bottom: 30px;
}

.btn {
  height: 75px;
}

.close-btn {
  z-index: 9999;
  position: absolute;
  width: 34px;
  height: 34px;

  .close-img {
    width: 34px;
    height: 34px;
  }
}

.wrapper {
  //position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  //background: rgba(16, 21, 20, 0.5);

  .preview-img {
    width: 252px;
    height: 475px;
  }
}

.content {
  height: 100%;
  text-align: center;
}

.canvas-content {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  .canvas-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .canvas {
    z-index: 1001;
    //margin-top: 1000px;
    //background: #fff;
    //border-radius: 20px;
    //overflow: hidden;
  }

  .button-wrapper {
    margin-top: 32px;
    //position: fixed;
    height: 70px;
    z-index: 1000;
    display: flex;
    width: 100%;
    justify-content: space-around;
    max-width: 710rpx;
  }

  .save-btn {
    z-index: 1001;
    width: 100rpx;
    height: 100rpx;
    background: #fff;
    border-radius: 50%;
  }

  .cancel-btn {
    color: $uni-btn-color;
    background: #fff;
  }

  .canvas-close-btn {
    position: fixed;
    top: 30rpx;
    right: 0;
    z-index: 1001;
    width: 60rpx;
    height: 60rpx;
    padding: 20rpx;
  }
}

.button-color {
  line-height: 36rpx;
  color: rgba(255, 255, 255, 1);
}
</style>
