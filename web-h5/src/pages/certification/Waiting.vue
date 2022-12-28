<template>
<view class="content">
<!--  <uni-nav-bar title="实名认证中"/>-->
  <view class="circle" >
    <circle-progress :percent="percent" :width="210" activeColor="rgba(40, 174, 95, 1)">
      <text class="fs-72">{{second}}S</text>
    </circle-progress>
  </view>
  <view class='ta-c fs-58'>审核中</view>
  <view class="ta-c fs-20 fc-93 mt-5">正在查询审核结果，请等待...</view>
  <view class="ta-c fs-20 fc-93 mt-5 fc-red">实名认证中，请勿刷新页面</view>
</view>
</template>

<script>
import CircleProgress from '@/components/circle-progress/index'
import { verifyRealName,queryRealName } from '@/api/certification'
let ID='';
let times=null;
let timesSync=null;
export default {
  name: "Waiting",
  data(){
    return{
      percent:0,
      second:10,
      remainTime:0,
      backButtonPress:0,
      reqData:{},
      isGo:false
    }
  },
  async onLoad(){
    let option = this.$Route.query
    const req={
      name:option.name,
      phone:option.phone,
      cardId:option.cardId
    }
    this.reqData=req;
    //判断是否刷新页面进入
    const isWaitingTime = uni.getStorageSync('is-waiting');
    if(isWaitingTime){
      uni.setStorageSync('is-waiting',false);
      setTimeout(()=>{
        this.isGo=true
        clearInterval(times)
        clearInterval(timesSync)
        uni.navigateBack({delta:1})
      },1000)
      this.timer();
      this.timerAsync();
    }else{
      clearInterval(times)
      clearInterval(timesSync)
      verifyRealName(req).then(res=>{
        if(res.code==='10036'){
          uni.$u.toast('正在验证，请勿重复认证')
          setTimeout(()=>{
            this.isGo=true
            clearInterval(times)
            clearInterval(timesSync)
            uni.navigateBack({delta:1})
          },1000)
        }else{
          this.timer();
          this.timerAsync();
        }
      })
    }
  },
  onShow(){
    //设置页面title
    document.title='实名认证中'
  },
  destroyed() {
    if(!this.isGo){
      uni.setStorageSync('is-waiting', true)
    }
  },
  components: {
    CircleProgress
  },
  methods:{
    timer(){
      let i=1;
      times=setInterval(()=>{
        if(this.second===0){
          clearInterval(times)
          clearInterval(timesSync)
          this.isGo=true
          if(uni.getStorageSync('is-waiting')){
            uni.$u.toast('认证超时')
          }else{
            this.onNavigateToPage('stateError',{reason:'认证超时'})
          }
          uni.setStorageSync('is-waiting',false);
        }else{
          i++;
          this.percent+=1;
          if(i%10===0){
            this.second-=1
          }
        }
      },100)
    },
    timerAsync(){
      timesSync=setInterval(()=>{
        this.remainTime=this.second
        if(this.second===0){
          clearInterval(timesSync)
        }
        queryRealName().then(res=>{
          if(res.data.status==='Verified'){
            clearInterval(timesSync)
            clearInterval(times)
            this.isGo=true
            if(uni.getStorageSync('is-waiting')){
              uni.$u.toast('认证成功')
            }else{
              this.onNavigateToPage('stateSuccess')
            }
            uni.setStorageSync('is-waiting',false);
          }else if(this.second===0&&res.data.status==='Processing'){
            uni.setStorageSync('is-waiting',false);
            setTimeout(()=>{
              uni.$u.toast('认证超时，请重试')
            },1000)
            uni.navigateBack({
              delta: 1
            });
            clearInterval(timesSync)
            clearInterval(times)
          }
        })
      },2000)
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
.fc-red{
  color: red;
}
</style>
