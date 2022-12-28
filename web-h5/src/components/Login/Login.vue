<template>
  <view>
    <u-action-sheet :show="showPop" @close="close" :round="10">
      <view class="flex fd-c">
        <view  class="of-a flex-1" :style="{'max-height': autoPopHeight*0.8+'px','min-height': autoPopHeight*0.3+'px'}">
          <view class="pos-abs-action">
            <img src="../../static/img/close-login-x.svg" alt="" class="w-h-40" @click="close">
          </view>
          <!--        <view v-if="isShowJump" class="fs-28 fc-7f ta-r pos-abs-jump" @click="close">跳过验证</view>-->
          <view :class="types===1?'flex-1 of-a pb-114 mt-96':'flex-1 of-a pb-114 mt-56'">
            <!--          <text class="fs-65 flex jc-c mb-1 fw-600">{{ types === 2 ? '实名认证' : title }}</text>-->
            <view v-if="types===1" class="flex jc-c mb-24">
              <image src="../../static/img/login-logo.svg" class="w-h-164"></image>
            </view>
            <view v-else class="fw-b fs-40 mb-32 lh-40">实名认证</view>
            <text :class="types===1?'flex jc-c fs-28 fc-7f mb-70 fw-b lh-28':'flex jc-c fs-28 fc-7f mb-84 fw-b lh-28'">
              {{ types === 1 ? '' : '购买藏品前需要进行实名认证' }}
            </text>

            <view v-if="types===1">
              <view class="px-4">
                <view class="flex mb-32">
                  <input type="number" class="inp-tel fw-b" placeholder="请输入手机号" placeholder-class="place-class"
                         :maxlength="11"
                         @input="telChange" :value="telInp" confirm-hold auto-blur :focus="focus"/>
                </view>
              </view>
              <view class="px-4 mb-80">
                <view class="flex">
                  <u--input placeholder="输入验证码" class="inp-color" fontSize="32rpx" :maxlength="6" type="number"
                            @change="codeInput" :value="codeInp" placeholderStyle="color:#aaaaaa">
                    <template slot="suffix">
                      <view class="pl-6 code-sty">
                        <u-code ref="uCode" seconds="60" @change="codeChange" changeText="x秒重新获取"
                                :fontSize="32">
                        </u-code>
                        <u-button plain size="mini" @tap="getCode" :text="tips" class="bg-btn-code"/>
                      </view>
                    </template>
                  </u--input>
                </view>
              </view>
              <view class="px-4 mb-4">
                <u-button
                  :customStyle="{'width': '100%','height': '102rpx','background': '#7948F7','border-radius':'20rpx','color':'#fff',
                'font-size':'34rpx','font-weight': 600}" :loading="loginLoading" loading-text="登录"
                  @click="$u.debounce(login, 500)">
                  登录
                </u-button>
              </view>
              <view class="px-4 flex ta-l">
                <view class="flex ai-c jc-c mr-16">
                  <image v-if="!checked" src="../../static/img/login-unchecked.svg" class="w-h-36"
                         @click="checkedChange(true)"></image>
                  <image v-if="checked" src="../../static/img/login-checked.svg" class="w-h-36"
                         @click="checkedChange(false)"></image>
                </view>
                <view class="fs-24 fc-7f fw-b">已阅读并同意
                  <text
                    class="fc-10 fs-24"
                    @click.stop="onNavigateToPage('userProtocol')">《用户协议》
                  </text>
                  和
                  <text
                    class="fc-10 fs-24"
                    @click.stop="onNavigateToPage('privacyAgreement')">《隐私政策》
                  </text>
                </view>
              </view>
            </view>


            <view v-else class="content">
              <u--input placeholder="输入手机号" clearable  size="large"
                        fontSize="32rpx" class="inp-color mb-2"
                        :value="certification.phone" disabled
                        :maxlength="11" disabledColor="#f5f5f5">
              </u--input>
              <u--input placeholder="输入真实姓名" clearable
                        fontSize="32rpx" size="large" class="inp-color my-32"
                        @input="nameChange" :value="certification.name" :maxlength="10"
                        :focus="!focus">
              </u--input>
              <u--input placeholder="输入身份证" clearable  size="large"
                        fontSize="32rpx" class="my-32 inp-color"
                        @input="cardChange" :value="certification.cardId" :maxlength="18">
              </u--input>
              <u-button v-show="!disabled" text="提交" class="h-1 fw-600"
                        :customStyle="{'width': '100%','height': '102rpx','background': '#7948F7','border-radius':'20rpx','color':'#fff',
                      'font-size':'34rpx','font-weight': 600}"
                        @click="certificationSubmit"/>
              <image v-show="disabled" src="../../static/img/certification-loading.gif" class="btn-img h-1"></image>
            </view>
          </view>
        </view>
      </view>

      <!--      -->

      <u-overlay :show="showCode" @click="showCode = false">
        <view class="warp">
          <view @tap.stop>
            <pt-images-verification
              :rightNum="ptCode['right']"
              :bgImg="ptCode['backImage']"
              :maskImg="ptCode['maskImage']"
              @success="success"
            />
          </view>
        </view>
      </u-overlay>
    </u-action-sheet>
  </view>
</template>

<script>
import {authorizeUser, sendCode} from '../../api/login'
import jwt from 'jsonwebtoken'
import {queryRealName, verifyRealName} from '../../api/certification'
import PtImagesVerification from '../pt-verification-images/components/pt-images-verification/pt-images-verification'
import {isWxOpen} from '../../util/util'
import {PtCode} from '../../util/pt-code'
import {getTicket} from '../../api/common'

export default {
  props: {
    //1表示登录，2表示实名认证
    type: {
      type: Number,
      default: 1
    },
    title: {
      Type: String,
      default:'登录后继续购买'
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    isAuto:{
      type:Boolean,
      default:true
    },
    noAuto:{
      type:Boolean,
      default:false
    }
  },
  components: {
    PtImagesVerification
  },
  data() {
    return {
      //图形验证码对象
      ptCode:{},
      isShowJump:false,
      showPop: false,
      autoHeight: 0,
      //图片验证码
      showCode: false,
      temp: false,
      focus:true,
      tips: '',
      types: 1,
      //登录相关
      telInp: "",
      codeInp: "",
      checked: false,
      //实名认证相关
      certification: {
        name: '',
        phone: '',
        cardId: ''
      },
      loginLoading:false,
      disabled:false,
      //弹窗高度适配
      autoPopHeight:document.documentElement.clientHeight,
      PtCode
    }
  },
  created() {
    this.init();
  },
  methods: {
    //init相关
    init() {
      //是否已经登录
      const idToken = uni.getStorageSync('id-Token')
      const userInfo = uni.getStorageSync('user-Info')
      this.types = this.type
      this.focus=true
      if (this.isShow&&this.isAuto) {
        if (idToken) {
          this.certification.phone = jwt.decode(idToken).Phone
          this.types = 2
          this.focus=false
          if (userInfo.IsRealName !== 'Verified') {
            this.showPop = !this.noAuto;
          } else {
            this.showPop = false;
          }
          // height-=100;
        } else {
          this.showPop = true;
        }
      } else {
        this.$emit('isAuto',true)
        this.$emit('changeTemp',false)
        this.focus=false
        this.showPop = false
      }
      this.autoH()
    },
    autoH(){
      const autoS = 750 / uni.getSystemInfoSync().screenWidth;
      const autoH = uni.getSystemInfoSync().screenHeight;
      let height=0;
      if(this.types===1){
        height = (500 * autoS)
      }else{
        height = (560 * autoS)
      }
      this.autoHeight = height
    },
    //登录相关
    telChange(e) {
      this.telInp = e.detail.value;
    },
    codeInput(e) {
      this.codeInp = e;
    },
    codeChange(text) {
      this.tips = text;
    },
    checkedChange(e) {
      this.checked = e;
    },
    nameChange(e) {
      this.certification.name = e;
    },
    cardChange(e) {
      this.certification.cardId = e;
    },
    async getCode() {
      if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/g.test(this.telInp))) {
        uni.$u.toast('请输入正确的手机号');
        return
      }
      if (!this.temp) {
        this.showCode = true
      } else {
        await this.success()
      }
    },
    async success() {
      if (this.$refs.uCode.canGetCode) {
        this.temp = false
        uni.showLoading({
          title: '正在获取验证码'
        })
        const req = {
          phone: this.telInp,
          usage: 'login'
        }
        this.showCode = false
        try {
          let res = await sendCode(req)
        }catch (e){
          this.loginLoading=false
          return
        }
        uni.hideLoading();
        uni.$u.toast('验证码已发送');
        this.temp = true
        this.$refs.uCode.start();
      } else {
        uni.$u.toast('倒计时结束后再发送');
      }
    },
    async login() {
      if (!this.telInp.trim()) {
        uni.$u.toast('请检查手机号');
      } else if (!this.codeInp.trim()) {
        uni.$u.toast('请检查验证码');
      } else if (!this.checked) {
        uni.$u.toast('请勾选协议');
      } else {
        const req = {
          clientId: "066cb24e9cac47eda81e5d189f24b94d",//a3d292feb696eb5b8c8dde8a10578845
          scope: "user",
          code: this.codeInp,
          deviceType: "H5",
          grantType: "code",
          user: this.telInp
        }
        this.loginLoading = true
        let res, idToken;
        try {
          res = await authorizeUser(req)
          this.loginLoading = false
          idToken = res.data.idToken
          uni.setStorageSync('id-Token-exp', jwt.decode(idToken).exp)
          uni.setStorageSync("id-Token", idToken);
          uni.setStorageSync('refresh-Token', res.data.refreshToken)
          uni.setStorageSync('user-Info', jwt.decode(idToken))


        }catch (e){
          this.loginLoading=false
          return
        }

        this.isShowJump=true
        //process.env.NODE_ENV!=='dev'
        uni.$u.toast('登录成功');
        //拉起实名认证,并设置手机号
        const userInfo = uni.getStorageSync('user-Info')
        const status = await queryRealName()
        if (status.data.status !== 'Verified') {
          this.types = 2
          this.autoH()
          this.showPop = true;
        } else {
          this.showPop = false;
          this.$emit('changeTemp', false)
        }
        this.certification.phone = userInfo.Phone
        //并提醒页面已登录
        this.$emit('isLogin', true);
        this.focus = false
      }
    },
    //实名认证
    async certificationSubmit() {
      const {
        name,
        phone,
        cardId
      } = this.certification
      if (name.trim() && cardId.trim()) {
        if (!(/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/g.test(cardId))) {
          uni.$u.toast('请输入正确的身份证号')
          return
        } else {
          // this.showPop = false
          // this.$emit('changeTemp', false)
          const req={
            name,
            phone,
            cardId
          }
          try {
            let i=1;
            this.disabled=true;
            try{
              await verifyRealName(req)
            }catch (e){
              this.disabled=false
              return
            }
            let timer = setInterval(async () => {
              try {
                const res = await queryRealName()
                if(res.data['status'] === 'Verified'||res.data['status'] === 'Failed'){
                  if(res.data['status'] === 'Verified'){
                    uni.showToast({
                      title:'实名认证成功',
                      icon:'none'
                    })
                  }else{
                    uni.showToast({
                      title:res.data.reason,
                      icon:'none'
                    })
                  }
                  clearInterval(timer)
                  this.disabled=false
                  let userInfo = uni.getStorageSync('user-Info')
                  userInfo.IsRealName=res.data['status']
                  uni.setStorageSync('user-Info',userInfo)
                  this.close()
                }else{
                  if(i > 9){
                    clearInterval(timer)
                    this.disabled=false
                    uni.showToast({
                      title:'认证超时，请重试',
                      icon:'none'
                    })
                  }
                  i++;
                }
              }catch (e){
                return
              }
            },1000)
          }catch (e) {
            return
          }
        }
      } else {
        uni.$u.toast('请检查必填项')
      }
    },
    close() {
      this.$emit('changeTemp', false)
      this.showPop = false
      this.focus=false
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(a) {
        this.showPop = a
        this.init()
      }
    },
    showCode:{
      immediate:true,
      handler(a){
        if(a){
          let num = Math.floor(Math.random()*(3))
          this.ptCode=this.PtCode[num]
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.h-auto {
  height: 100rpx;
}

.warp {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.rect {
  width: 420rpx;
  height: 120rpx;
  background-color: #fff;
}

::v-deep .uni-input-placeholder {
  overflow: visible;
  color: rgb(192, 196, 204);;
}

.pb-114 {
  padding-bottom: 114rpx;
}

.top-img {
  width: 106rpx;
  height: 120rpx;
  margin-top: 100rpx;
}

.fs-65 {
  font-size: 65rpx;
  line-height: 96rpx;
}

::v-deep .u-input--square {
  padding-left: 40rpx !important;
}

.fc-7f {
  color: #7F7F7F;
}

.w-h-40 {
  width: 33rpx;
  height: 33rpx;
}

.mb-70 {
  margin-bottom: 44rpx;
}
.mb-84{
  margin-bottom: 80rpx;
}

.inp-tel {
  height: 102rpx;
  width: 670rpx;
  padding-left: 40rpx;
  border-style: none;
  background: #f5f5f5;
  text-align: left;
  font-size: 32rpx;
  border-radius: 20rpx;
}
.inp-color {
  background: #f5f5f5;
  height: 102rpx;
  border-style: none;
  font-family: PingFang SC;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 20rpx;
  /*width: 690rpx;*/
}
.pos-rel {
  position: relative;
}

.inp-code {
  width: 670rpx;
  height: 100rpx;
  padding-left: 30rpx;
}

.fc-99 {
  color: #999999;
}

.pos-abs {
  position: absolute;
  right: 100rpx;
  bottom: 50rpx;
}

.pos-abs-action {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
}
.pos-abs-jump{
  position: absolute;
  right: 40rpx;
  top: 40rpx;
}

.code-sty {
  //border-left: 1rpx solid rgb(217, 217, 217);
  width: 279rpx
}

.bg-btn-code {
  background: rgb(247, 247, 247);
  border-style: none;
  font-size: 32rpx;
  color: #7f7f7f !important;
}

::v-deep .u-button__text {
  font-size: 32rpx !important;
}

.mb-80 {
  margin-bottom: 80rpx;
}

.fc-10 {
  color: #101010
}

.lh-40 {
  line-height: 40rpx;
}

.h-auto {
  height: 400rpx;
}

.bg-row {
  background: rgb(247, 247, 247)
}

.mb-150 {
  margin-bottom: 150rpx;
}


.f-col {
  color: rgb(93, 93, 91);
}

.h-1 {
  margin-top: 80rpx;
}

.h-120 {
  height: 120rpx;
}

.content {
  padding: 0 40rpx;
  margin-top: 10rpx;
}

.mt-96 {
  margin-top: 96rpx;
}
.mt-56{
  margin-top: 56rpx;
}
.w-h-164{
  width: 205rpx;
  height: 244rpx;
}
.mb-24{
  margin-bottom: 24rpx;
}
.mb-32{
  margin-bottom: 32rpx;
}
.place-class{
  color: #aaaaaa;
}
.w-h-36{
  width: 36rpx;
  height: 36rpx;
}
.mr-16{
  margin-right: 16rpx;
}
.my-32{
  margin: 32rpx 0;
}
.btn-img{
  width: 100%;
  height: 102rpx;
}
.lh-40{
  line-height: 40rpx;
  height: 40rpx;
}
.lh-28{
  line-height: 28rpx;
  height: 28rpx;
}
</style>
