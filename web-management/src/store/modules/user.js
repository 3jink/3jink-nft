import storage from 'store'
import {login} from '@/api/login'
import {ID_TOKEN, REFRESH_TOKEN} from '@/store/mutation-types'
import {welcome} from '@/utils/util'
import {role} from './roles'
import {setDocumentTitle} from '@/utils/domUtil'

let jwt = require('jsonwebtoken') //引入jwt解析token

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    permission:storage.get('permission'),
  },

  mutations: {
    SET_ID_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {name, welcome}) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    PERMISSION: (state, info) => {
      state.permission = info
    }
  },

  actions: {
    // 登录
    //只需要这个接口返回token并存下来，就可以进入系统
    async Login({commit}, userInfo) {
      // console.log(userInfo);
      const res = await login(userInfo)
      if (res && res.data) {
        // console.log(res);
        const idToken = res.data.idToken
        const refreshToken = res.data.refreshToken
        storage.set(ID_TOKEN, idToken)
        commit('SET_ID_TOKEN', idToken)
        let claims = jwt.decode(idToken)
        //解密后的idToken
        storage.set('user-info', claims)
        storage.set('id-Token-exp', claims.exp)
        storage.set(REFRESH_TOKEN, refreshToken)
        commit('SET_REFRESH_TOKEN', refreshToken)
        return res
      }
    },

    // 获取用户信息
    //前端控制权限设置
    GetInfo({commit}) {
      return new Promise((resolve, reject) => {
        const response = role
        const result = response.result

        if (result.role && result.role.permissions.length > 0) {
          const role = result.role
          role.permissions = result.role.permissions
          role.permissions.map(per => {
            if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
              const action = per.actionEntitySet.map(action => {
                return action.action
              })
              per.actionList = action
            }
          })
          role.permissionList = role.permissions.map(permission => {
            return permission.permissionId
          })
          commit('SET_ROLES', result.role)
          commit('SET_INFO', result)
        } else {
          reject(new Error('getInfo: roles must be a non-null array !'))
        }

        commit('SET_NAME', {name: result.name, welcome: welcome()})
        commit('SET_AVATAR', result.avatar)

        resolve(response)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    //获取按钮权限
    //获取权限相关
    setPermission({commit, state}) {
      const claim = jwt.decode(storage.get('id-Token'))
      if (claim) {
        const permissions = claim.ProfileNo.split(',')
        let permission = permissions.indexOf('management_supper_admin') !== -1
        // let merchantPermission=permissions.indexOf('management_merchant_admin') !== -1
        //获取是否只有商户
        let merchantPermission=(permissions.length===1&&permissions.indexOf('management_merchant_admin')!==-1)
        storage.set('permission',permission)//为true表示有超级管理员权限
        storage.set('merchant-permission',merchantPermission)//为true表示有且仅有商户权限
      }
    },

    // 登出
    Logout({commit, state}) {
      return new Promise((resolve) => {
        commit('SET_ID_TOKEN', '')
        commit('SET_ROLES', [])
        storage.clearAll()
        setDocumentTitle('NFT 管理端')
        resolve()
      })
    }

  }
}

export default user