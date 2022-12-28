<template>
  <view class="content flex fd-c">

    <!--    <uni-nav-bar title="设置" left-icon="left"/>-->
    <view class="flex-1 of-a setting-box">
      <Login :isShow="isShow" @changeTemp="changeTemp" pages="/pages/"/>
      <u-action-sheet :show="showPop" @close="showPop = false" :round="10">
        <view class="top-title flex jc-sb ">
          <view class="w-h-32 ml-4"></view>
          <view class="fs-40 edit-my fw-600">修改{{ tempNickNameOrInfo ? '个性签名' : '昵称' }}</view>
          <image src="@/static/img/close-login-x.svg" class="w-h-32 mt-4 mr-4" @click="showPop=false"></image>
<!--          <view class="fs-34 mt-4 mr-4 w-80 fc-40" @click="editNickNameOrInfo">完成</view>-->
        </view>
        <view class="px-4 mb-60">
          <u--input v-if="!tempNickNameOrInfo" placeholder="请输入昵称" class="inp-color"
                    fontSize="34rpx" :value="nickName" @input="(e)=>nickName=e" :maxlength="10" :focus="focus"
                    @blur="blurNickName" @focus="focusNickName">
            <template slot="suffix">
              <view class="fs-x flex ai-c jc-c" @click="nickName='';focus=true">
                <img src="@/static/img/del-word-x.svg" alt="" class="w-h-41">
              </view>
            </template>
          </u--input>
          <u--textarea v-else placeholder="请输入个性签名" class="inp-area-color"
                       :value="info" @input="(e)=>info=e" count :maxlength="40" confirmType="done" :focus="true"
                       :selectionStart="1">
<!--            <template slot="suffix">-->
<!--              <view class="cha-sty flex ai-c jc-c" @click="info=''">×</view>-->
<!--            </template>-->
          </u--textarea>
        </view>
        <u-button text="完成" class="pos-btn-edit" :loading="editLoading" loading-text="完成"
                  :customStyle="{'font-size':'32rpx'}"
                  ref="handClick"  @click="editNickNameOrInfo"/>
      </u-action-sheet>
<!--      <u-action-sheet :show="showPopLogout" @close="showPopLogout = false" :round="10" cancelText="取消">-->
<!--        <view class="py-4 fc-red fs-38" @click="logout">-->
<!--          退出登录-->
<!--        </view>-->
<!--      </u-action-sheet>-->
      <u-popup :show="showPopLogout" @close="showPopLogout = false" mode="center" round="10">
        <view class="flex ai-c fd-c pop-w">
          <view class="fw-600 fs-36 title-outLog">确定退出登录</view>
          <view class="flex jc-c ai-c">
            <u-button text="取消" class="pos-btn-out-cancel" :customStyle="{'font-size':'34rpx'}"
                      ref="handClick"  @click="showPopLogout = false"/>
            <u-button text="退出登录" class="pos-btn-out-sure" :customStyle="{'font-size':'34rpx'}"
                      ref="handClick"  @click="logout"/>
          </view>
        </view>
      </u-popup>
      <view class="top-2 flex ai-c jc-sb my-5 pl-4 pr-3">
        <text class="fs-32 fw-600">头像</text>
        <view class="flex ai-c jc-c">
          <Upload :is-circle="true" :is-default="true" :height="70" :width="70" :img-url="userInfo.Avatar||''"
                  :is-auto="true"
                  @error="fileError = true"
                  @getUrl="getAvatar"
                  :isAvatar="true"/>
        </view>
      </view>
      <view class="top-2 flex ai-c jc-sb my-5 px-4">
        <text class="fs-32 fw-600">昵称</text>
        <view class="flex ai-c jc-c" @click="editNickName(1)">
          <text class="fc-99 mr-3 fs-28 fw-600">{{ userInfo.NickName || '暂无昵称' }}</text>
          <view class="fs-44 fc-99 flex ai-c"><img src="@/static/img/arrow-right.svg" alt="" class="w-h-24"></view>
        </view>
      </view>
      <view class="top-1 flex ai-c jc-sb  my-5 px-4">
        <text class="fs-32 fw-600">个性签名</text>
        <view class="flex ai-c jc-c" @click="editNickName(2)">
          <text class="fc-99 mr-3 fs-28 fw-600">
            {{userInfo.Remark &&  userInfo.Remark.length >= 10 ? userInfo.Remark.slice(0,10) + '...' :
            userInfo.Remark  || '请添加签名'}}
          </text>
          <view class="fs-44 fc-99 flex ai-c"><img src="@/static/img/arrow-right.svg" alt="" class="w-h-24"></view>
        </view>
      </view>
      <view class="divide-line mx-4"/>
      <view class="top-2 flex ai-c jc-sb  my-5 px-4">
        <text class="fs-32 fw-600">手机号</text>
        <view class="flex ai-c jc-c">
          <text class="fc-99 fs-28 fw-600">{{ userInfo.Phone }}</text>
        </view>
      </view>
      <view class="top-1 flex ai-c jc-sb my-5 px-4">
        <text class="fs-32 fw-600">实名认证</text>
        <view class="flex ai-c jc-c" @click="certification">
          <text class="fc-99 mr-3 fs-28 fw-600">{{ userInfo.IsRealName === 'Verified' ? '已认证' : '未认证' }}</text>
          <view class="fs-44 fc-99 flex ai-c"><img src="@/static/img/arrow-right.svg" alt="" class="w-h-24"></view>
        </view>
      </view>
      <view class="divide-line mx-4"/>
      <view class="top-2 flex ai-c jc-sb my-5 px-4"
            @click="onNavigateToPage('userProtocol')">
        <text class="fs-32 fw-600">使用协议</text>
        <view class="flex ai-c jc-c">
          <view class="fs-44 fc-99 flex ai-c"><img src="@/static/img/arrow-right.svg" alt="" class="w-h-24"></view>
        </view>
      </view>
      <view class="top-2 flex ai-c jc-sb my-5 px-4"
            @click="onNavigateToPage('privacyAgreement')">
        <text class="fs-32 fw-600">隐私政策</text>
        <view class="flex ai-c jc-c">
          <view class="fs-44 fc-99 flex ai-c"><img src="@/static/img/arrow-right.svg" alt="" class="w-h-24"></view>
        </view>
      </view>
      <u-button text="退出登录" class="pos-btn" :customStyle="{'font-size':'32rpx'}" @click="showPopLogout=true"
                ref="handClick"/>
    </view>
  </view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
import Upload from '@/components/upload/Upload'
import Login from '@/components/Login/Login'
import {editUserInfo} from '@/api/login'

export default {
  data() {
    return {
      tips: '',
      showPop: false,
      showPopLogout: false,
      isShow: false,
      userInfo: {},
      tempNickNameOrInfo: false,
      nickName: '',
      info: '',
      focus: true,
      editLoading:false,
      clearNickNameTemp: false,
      fileError:false
    }
  },
  components: {
    uniNavBar, Upload, Login
  },
  created() {
    const userInfo = uni.getStorageSync('user-Info')
    this.userInfo = userInfo
  },
  onShow() {
    //设置页面title
    document.title = '个人设置'
  },
  methods: {
    editNickName(temp) {
      this.focus = false
      this.focus = true
      if (temp === 1) {
        this.tempNickNameOrInfo = false;
        this.nickName = this.userInfo.NickName
        this.showPop = true;
      } else {
        this.tempNickNameOrInfo = true;
        this.info = this.userInfo.Remark;
        this.showPop = true;
      }
    },
    certification() {
      if (this.userInfo.IsRealName === 'Verified') {
        uni.$u.toast('已完成认证')
        return
      } else if (this.userInfo.IsRealName === 'Processing') {
        uni.$u.toast('正在认证中，无法继续认证')
        return
      }
      this.isShow = true;
    },
    blurNickName() {
      this.focus = false
      if (this.clearNickNameTemp) {
        this.focus = true
      }
    },
    focusNickName() {
      // this.focus=false
    },
    getAvatar(url) {
      this.editUserInfo({name: 'Avatar', value: url});
      this.userInfo.Avatar = url;
    },
    getThemeImage(url) {
      this.editUserInfo({name: 'ThemeImageFile', value: url});
      this.userInfo.ThemeImageFile = url;
    },
    async editUserInfo(temp) {
      const reqData = {
        "items": [
          {
            "claimType": temp.name,
            "claimValue": temp.value,
            "shouldIssueToken": true
          }
        ]
      }
      const userInfo = uni.getStorageSync('user-Info')
      if (temp.name === 'Avatar') {
        if (temp.value !== '' && temp.value !== userInfo['Avatar']) {
          // if(!this.fileError){
          const res = await editUserInfo(reqData);
          uni.setStorageSync('user-Info', this.userInfo)
          uni.$u.toast('修改个人信息成功')
          // }
        }
      } else if (temp.name === 'ThemeImageFile') {
        if (temp.value !== '' && temp.value !== userInfo['ThemeImageFile']) {
          const res = await editUserInfo(reqData);
          uni.setStorageSync('user-Info', this.userInfo)
          uni.$u.toast('修改个人信息成功')
        }
      } else {
        const res = await editUserInfo(reqData);
        uni.setStorageSync('user-Info', this.userInfo)
        uni.$u.toast('修改个人信息成功')
      }
    },
    async editNickNameOrInfo() {
      if (!this.tempNickNameOrInfo) {
        if (!this.nickName.trim()) {
          uni.$u.toast('昵称不能为空')
          this.focus = false
          this.focus = true
          return
        }
        this.editLoading = true
        await this.editUserInfo({name: 'NickName', value: this.nickName.trim()});
        this.userInfo.NickName = this.nickName.trim();
        this.editLoading = false
      } else {
        if (!this.info.trim()) {
          uni.$u.toast('个性签名不能为空')
          this.focus = false
          this.focus = true
          return
        }
        this.editLoading = true
        this.userInfo.RemarkShort = this.info.slice(0, 10)
        await this.editUserInfo({name: 'Remark', value: this.info.trim()});
        this.userInfo.Remark = this.info.trim();
        this.editLoading = false
      }
      uni.setStorageSync('user-Info', this.userInfo)
      this.showPop = false;
    },
    changeTemp() {
      this.isShow = false
      this.showPop = true
      this.showPop = false
      this.focus = false
      //重新获取userInfo
      this.userInfo = uni.getStorageSync('user-Info')
    },
    logout() {
      const ipName = uni.getStorageSync('ip-Name')
      uni.clearStorageSync();
      uni.setStorageSync('ip-Name',ipName)
      this.showPopLogout = false
      uni.reLaunch({url: '/pages/userCenter/Index'})
      uni.$u.toast('退出登录成功')
    },
  }
}
</script>

<style lang="scss" scoped>
@import "static/css/variable";
.content {
  position: relative;
}

.setting-box {
  padding-bottom: 60rpx;
}

::v-deep .u-button__text {
  font-size: 34rpx !important;
}

.top-1 {
  height: 60rpx;
  line-height: 48rpx;
}

.line {
  height: 2rpx;
  background: rgb(231, 231, 231);
  width: 670rpx;
  margin-left: 40rpx;
}

.top-2 {
  height: 60rpx;
  line-height: 48rpx;
}

.u-cell__body {
  padding: 0 !important;
}

.fs-34 {
  font-size: 34rpx;
}

.fs-30 {
  font-size: 30rpx;
}

.pos-btn {
  position: absolute;
  bottom: 60rpx;
  right: 250rpx;
  width: 250rpx;
  height: 102rpx;
  font-weight: bold;
  border: none;
  font-size: 34rpx;
  background: #EEEEED;
  border-radius: 20rpx;
}

.fc-99 {
  color: #999999;
}

.cb-22 {
  color: #222222;
  font-size: 34rpx;
}

.w-h-24 {
  width: 24rpx;
  height: 27rpx;
}

.w-h-41 {
  width: 40rpx;
  height: 40rpx;
}

::v-deep .u-cell__body {
  padding: 20rpx 40rpx;
}

.fc-40 {
  color: rgba(40, 174, 95, 1);
}

.w-80 {
  width: 80rpx;
}

.my-6 {
  margin: 60rpx 0;
}

.cha-sty {
  font-size: 40rpx;
  border-radius: 50%;
  width: 44rpx;
  height: 44rpx;
  background: rgba(222, 222, 222, 1);
  color: white;
}

.inp-color {
  background: #f5f5f5;
  height: 100rpx;
  width: 670rpx;
  text-align: left;
  font-weight: bold;
  border-radius: 20rpx;
}

.inp-area-color {
  background: rgb(247, 247, 247);
  height: 180rpx;
  width: 670rpx;
  text-align: left;
  font-weight: bold;
  border-radius: 20rpx;
}

::v-deep .u-border {
  border: none;
}

::v-deep .u-textarea__field{
  font-size: 34rpx !important;
}

.mb-60 {
  margin-bottom: 60rpx;
}

.fs-x {
  font-size: 60rpx;
  color: rgba(51, 51, 51, 1);
}

.fc-red {
  color: rgba(249, 81, 81, 1);;
}

::v-deep .u-input--square {
  padding: 0rpx 40rpx !important
}

::v-deep .u-textarea__count {
  background: rgb(247, 247, 247) !important;
  padding: 0 20rpx 20rpx 0;
}

.w-h-32 {
  width: 32rpx;
  height: 32rpx;
}
.edit-my{
  margin-top: 56rpx;
  margin-bottom: 80rpx;
  height: 40rpx;
  line-height: 40rpx;
}
.pos-btn-edit {
  width: 320rpx;
  height: 96rpx;
  font-weight: bold;
  border: none;
  color: white;
  font-size: 34rpx;
  background: #7948F7;
  border-radius: 20rpx;
  margin-bottom: 64rpx;
}
.pop-w{
  width: 630rpx;
}
.title-outLog{
  margin: 60rpx 0 68rpx 0;
}
.pos-btn-out-cancel {
  width: 260rpx;
  height: 92rpx;
  font-weight: bold;
  border: none;
  color: black;
  font-size: 34rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  margin-bottom: 44rpx;
  margin-right: 30rpx;
}
.pos-btn-out-sure{
  width: 260rpx;
  height: 92rpx;
  font-weight: bold;
  border: none;
  color: white;
  font-size: 34rpx;
  background: #DC2F2F;
  border-radius: 20rpx;
  margin-bottom: 44rpx;
}
::v-deep .u-textarea{
  padding: 20rpx 40rpx;
}
</style>
