<template>
  <div class="main">
    <div class="content">
      <a-form
        id="formLogin"
        ref="formLogin"
        :form="form"
        layout="horizontal"
        @submit="handleSubmit"
        :label-col="{ span: 3 }" :wrapper-col="{ span: 16 }"
        labelAlign="left"
      >
        <a-form-item class="jc-c flex-item">
          <template slot="label">
            <span>账&#12288号</span>
          </template>
          <a-input type="text" placeholder="请输入手机号" suffix=" " :maxLength="11"
                   v-decorator="['mobile', {rules: [{required: true, message: '请输入手机号', trigger: 'blur'},
                   { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
          </a-input>
        </a-form-item>
        <a-form-item class="jc-c flex-item">
          <template slot="label">
            <span>验证码</span>
          </template>
          <a-input type="text" placeholder="请输入验证码" :maxLength="6"
                   v-decorator="['captcha', {rules: [{required: true, message: '请输入验证码', trigger: 'blur'},
                   {pattern: /^\d{6}$/, message: '请输入正确的验证码' }], validateTrigger: 'change'}]">
            <template slot="suffix">
              <a-button
                size="small"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
                v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                style="border: none;color: #799BF0"
              ></a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-button
          type="primary"
          htmlType="submit"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          class="my-2 w-83"
        >登录
        </a-button>
      </a-form>
    </div>

  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import {mapActions} from 'vuex'
import {timeFix} from '@/utils/util'
import {sendCode} from '@/api/login'
import storage from 'store'
import store from '@/store'
import {notification} from 'ant-design-vue'

export default {
  components: {
    TwoStepCaptcha
  },
  data() {
    return {
      isClick: true,
      customActiveKey: 'tab1',
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),//将vuex中的Login引入
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: {validateFields},
        state,
        customActiveKey,
        isClick,
        Login
      } = this
      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab2' ? ['username', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, {force: true}, (err, values) => {
        if (!err) {
          const loginParams = {...values}
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          loginParams.password = values.password
          customActiveKey === 'tab2' ? loginParams.grantType = 'password' : loginParams.grantType = 'code'
          Login(loginParams).then(res => {
            if (res) {
              storage.set('remember', isClick)
              storage.set('port', 'NFT管理端')
              store.dispatch('setPermission')
              this.loginSuccess()
            }
          }).finally((e) => {
            state.loginBtn = false
          })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {form: {validateFields}, state} = this

      validateFields(['mobile'], {force: true}, async (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          try {
            let res = await sendCode({
              phone: values.mobile,
              usage: 'login'
            })
            this.$notification['success']({
              message: '提示',
              description: res.msg,
              duration: 8
            })
          } catch (e) {
          }
        }
      })
    },
    loginSuccess() {
      this.$router.push({path: '/'})
      // 延迟 1 秒显示欢迎信息
      this.$message.success(`${timeFix()}，欢迎回来`)

      // //站内提示
      // this.$notification.info({
      //   duration:null,
      //   message: '您有新的消息',
      //   description:
      //     '有新的申请，请审核(^_^)',
      // });
      this.isLoginError = false
    },
    requestFailed(err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description:err.response?.data?.message ,//((err.response || {}).statistics || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.flex-item{
  display: flex
}
.w-83{
  width: 82%;
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 20px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
