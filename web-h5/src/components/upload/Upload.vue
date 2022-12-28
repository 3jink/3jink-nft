<template>
  <view class="w-100 image-wrapper">
    <image :src="isDefault?'../../static/img/default-avatar.png':'../../static/img/plus-add.svg'" v-show="!imageURl"
           @click="chooseImage"
           :style="{width:width+'rpx',height: height+'rpx',borderRadius:isCircle?'50%':''}"></image>
    <image v-show="imageURl" :src="imageURl"
           :style="{width:width+'rpx',height: height+'rpx',borderRadius:isCircle?'50%':''}"
           @click="chooseImage" @error="onErrorImg" mode="aspectFill"></image>
  </view>
</template>

<script>
// import {accessView, uploadImg} from '../../api/common'
import {uploadFile} from '../../api/file'

export default {
  name: "Upload",
  props: {
    height: {
      type: Number,
      default: 80
    },
    width: {
      type: Number,
      default: 80
    },
    imgUrl: {
      type: String,
      default: ''
    },
    isDefault:{
      type: Boolean,
      default: false
    },
    fileType: {
      type: String,
      /*
      * 1   表示   bieName = nftArts *
      * 2   表示   bieName = nftFile *
      * 3   表示   bieName = userSpace
      * */
      default: '3'
    },
    isAuto: {
      type: Boolean,
      default: false
    },
    isAvatar: {
      type: Boolean,
      default: false
    },
    isCircle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageList: [],
      file: null,
      imageURl: '',
      fileList: [],
      editFileTemp: false,
      client: '',
      objectName: '',
      signedUrl: '',
      imgBlob: '',
      widths: 0,
      heights: 0
    }
  },
  computed: {
  },
  methods: {
    onErrorImg(e){
      uni.showToast({
        'title':'该文件存在错误，请重新进入页面上传文件',
        'icon':'none'
      })
      this.$emit('error','')
    },
    chooseImage() {
      let _this = this;
      uni.chooseImage({
        count: 1, //最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], //original 原图，compressed 压缩图，默认二者都有
        success: async response => {
          this.file = await fetch(response.tempFilePaths[0]).then(r => r.blob())
          try {
            let res = await uploadFile(this.file)
            uni.$u.toast('上传成功！')
            this.imageURl = response.tempFilePaths[0]
            this.$emit('getUrl', res.data.file)
          } catch (e) {
            uni.showToast({
              title:'文件上传错误，请重新上传其他文件',
              icon:'none'
            })
          }
        },
        fail() {
          console.log('失败', err);
        },
        complete() {
          console.log('结束');
        },
      })
    },
  },
  watch: {
    imgUrl: {
      immediate: true,
      handler(a) {
        const baseUrl = process.env.VUE_APP_BASE_URL;
        if (!a.trim()) return
        this.imageURl = baseUrl+"/api/v1/file/" + a
      }
    }
  }
}
</script>

<style scoped lang="scss">
.image-wrapper {
  width: 100%;
}
</style>
