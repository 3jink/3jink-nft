import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 创建一个 store
const store = new Vuex.Store({
  // (1)初始 state 对象
  state: {
    // token
    idToken: '',
    refreshToken: '',


  },
  // (2)定义一些mutation
  mutations: {
    SET_ID_TOKEN(state, company) {
      state.idToken = company;
    },
    SET_REFRESH_TOKEN(state, company) {
      state.refreshToken = company;
    },
  },
  actions: {
    async Login({commit}, req) {
      try {
        let res = await allowRequest({
          url: '/connect/authorizeUser',
          method: 'post',
          data: req
        })
        uni.setStorageSync('id-token', res?.data?.idToken)
        uni.setStorageSync('refresh-token', res?.data?.refreshToken)
        commit('SET_ID_TOKEN', res?.data?.idToken)
        commit('SET_REFRESH_TOKEN', res?.data?.refreshToken)
        let tokenObj = jwt.decode(res?.data?.idToken)
        uni.setStorageSync('user-role', tokenObj.ProfileNo)
        uni.setStorageSync('user-id', tokenObj.UserId)
        uni.switchTab({
          url: `/pages/tabBar/index/index`,
          fail(err) {
          },
          success(res) {
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
})

// 导出该模块:以便其他文件可对其进行使用
export default store
