<template>
<view class="content">
<!--  <uni-nav-bar title="认证成功"/>-->
  <view class="circle" >
    <image src="@/static/img/success.svg" class="w-d-210"/>
  </view>
  <view class='ta-c fs-58'>实名认证成功</view>
  <u-button text="确定" class="w-670 fs-40" color="#28AE5F" @click="navigatorTo"/>
</view>
</template>

<script>
import CircleProgress from '@/components/circle-progress/index'
export default {
  name: "Success",
  data(){
    return{
      percent:0
    }
  },
  created(){
    uni.setStorageSync('is-waiting',false);
    let userInfo = uni.getStorageSync('user-Info')
    userInfo.IsRealName='Verified'
    uni.setStorageSync('user-Info',userInfo)
  },
  onShow(){
    //设置页面title
    document.title='认证成功'
  },
  components: {
    CircleProgress
  },
  methods:{
    navigatorTo(){
      uni.navigateBack({delta:2})
    }
  }
}
</script>

<style scoped lang="scss">
@import "static/css/variable";
.circle{
  padding: 150rpx 280rpx 75rpx 280rpx;
}
.fs-72{
  font-size: 72rpx;
}
.fs-58{
  font-size: 58rpx;
}
.fc-93 {
  color: rgb(93, 93, 91);
}
.w-d-210{
  width: 210rpx;
  height: 210rpx;
}
.w-670{
  margin-top: 80rpx;
  width: 670rpx;
}
::v-deep .u-button--square{
  border: 0 !important;
}
</style>
