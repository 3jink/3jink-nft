<template>
  <div>

    <template v-if="imageList.length>0">
      <img v-for="item in imageList" :key="item" :src="item" class="imgSty" @click="openModal(item)"
           :height="height"
           :width="width" :style="isCircle?'border-radius: 50%!important':''"/>
    </template>
    <img class="imgSty" :style="isCircle?'border-radius: 50%!important':''" v-else
         src="../../assets/icons/logo.png"
         :height="height" :width="width"/>
    <a-modal :maskClosable="true" :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="图片获取失败" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>

<script>
import {accessView} from '@/api/common'

export default {
  props: {
    isPreview: {
      type: Boolean,
      default: false
    },
    imgStr: {
      type: String,
      default: ''
    },
    width: {
      type: Number | String,
      default: '100%'
    },
    height: {
      type: Number | String,
      default: '100%'
    },
    isCircle: {
      type: Boolean,
      default: false,
    },
    isBg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageList:[],
      previewImage: '',
      previewVisible: false,
      isExit: false,
      defaultImage: ''
    }
  },
  name: "ViewPicture",
  methods: {
    openModal(item) {
      this.previewImage = item
      this.previewVisible = true;
    },
    handleCancel() {
      // this.$emit('previewVisible', false)
      this.previewVisible = false;
    },
    // 获取图片地址
    getOAccessView() {
      let arr = this.imgStr.trim().split(',')
      this.imageList = []
      const baseUrl = process.env.VUE_APP_BASE_URL;
      arr.forEach((item,index) => {
        let req = baseUrl+'/api/v1/file/'+item
        if (!item.trim()) return
        // accessView(req).then(res => {
          this.$set(this.imageList,index,req)
        // })
      })
    }
  },
  created() {
    // this.getOAccessView()
  },

  watch: {
    imgStr: {
      immediate: true,
      handler(a, b) {
        this.isExit = a.search(',') > -1
        if (a) {
          this.getOAccessView()
        }else{
          this.imageList=[]
        }
      }
    },


  }
}
</script>

<style scoped>
.imgSty {
  object-fit: cover;
}

.imgSty:hover {
  opacity: 0.7;
}
</style>