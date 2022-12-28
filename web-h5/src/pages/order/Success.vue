<template>
  <view class="content fd-c">
    <!--    <uni-nav-bar title="购买成功" />-->
    <view class="flex-1 of-a">
      <view class="pay-box"/>
      <text class="success flex ai-c jc-c mb-28 fw-b">购买成功</text>
      <view class="nft-address">
        <view class="ta-c fs-28 fw-b">恭喜你，获得 {{ name || '默认' }} 数字藏品</view>
        <!--        <view class="ta-c">{{ address }}</view>-->
      </view>
      <u-button class="btn fw-b" @click="onNavigateToPage('index')">查看我的藏品
      </u-button>
<!--            <view class="ta-c share-box fw-b fs-28">分享给好友</view>-->
    </view>
  </view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar'

export default {
  data() {
    return {
      address: '',
      name: ''
    }
  },
  onLoad() {
    let option = this.$Route.query
    this.address = option.address
    this.name = option.name
  },
  onShow() {
    //设置页面title
    document.title = '购买成功'
  },
  components: {
    uniNavBar
  },
  methods: {},
}
</script>

<style lang="scss">
@import "static/css/variable";

.pay-box {
  width: 120rpx;
  height: 120rpx;
  margin: 100rpx 315rpx 68rpx 315rpx;
  background: url("@/static/img/pay-success.svg") no-repeat;
  background-size: cover;
}

.nft-address {
  color: #7F7F7F;
  margin-bottom: 52rpx;
  line-height: 32rpx;

  > view:first-child {
    margin-bottom: 12rpx;
  }
}

.btn {
  width: 670rpx;
  height: 104rpx;
  background: #7948F7;
  border-radius: 20rpx;
  color: #fff;
  font-size:34rpx;
  margin-bottom: 44rpx;
}

.share-box {
  color: #101010;
}

.success {
  color: #101010;
  font-size: 44rpx;
  line-height: 44rpx;
}
.mb-28{
  margin-bottom: 28rpx;
}
</style>
