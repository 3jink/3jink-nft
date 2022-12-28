<template>
  <view class="content">
    <image class="error-img" src="@/static/img/404.svg" alt="" />
    <view class="flex jc-c ai-c error-text">页面找不到了~</view>
  </view>
</template>

<script>
export default {
  name: "notFound"
}
</script>

<style scoped lang="scss">
.error-img {
  width: 280rpx;
  height: 106rpx;
  margin: 220rpx auto 88rpx 235rpx;
}
.error-text{
  height: 28rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #BFBFBF;
  line-height: 28rpx;
}
</style>
