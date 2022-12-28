<template>
  <view v-if="isBg" class="bgs" :style="{'backgroundImage': `url(${imageUrl})`}">
    <slot></slot>
  </view>
  <img v-else-if="isPro" :src="imageUrl" class="image" :mode="mode"/>
  <image v-else :src="imageUrl" class="image" :mode="mode"/>
</template>

<script>

export default {
  name: "ImageView",
  props: {
    width: {
      type: String,
      default: '160rpx'
    },
    height: {
      type: String,
      default: '160rpx'
    },
    mode: {
      type: String,
      default: 'aspectFill'
    },
    imgUrl: {
      type: String,
      default: ''
    },
    isBg: {
      type: Boolean,
      default: false
    },
    defaultAvatar: {
      type: Boolean,
      default: false
    },
    isPro: {
      type:Boolean,
      default:false
    },
    customStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }

  },
  data() {
    return {
      imageUrl: this.defaultAvatar ? '../../static/img/mine.svg' : '../../static/img/default-banner.svg'
    }
  },
  methods: {
    async getUrlView(url) {
      const baseUrl = process.env.VUE_APP_BASE_URL;
      if (!url.trim()) return
      this.imageUrl = this.imageURl = baseUrl+"/api/v1/file/" + url
      this.$emit('getUrl', this.imageUrl)
    }
  },
  watch: {
    imgUrl: {
      immediate: true,
      handler(a) {
        if (a) {
          this.getUrlView(a)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.image {
  width: 100%;
  height: 100%;
  position: relative;
}

.bgs {
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>
