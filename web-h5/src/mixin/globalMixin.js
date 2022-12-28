import {funcUrlDel, getUrlParam, isWxOpen} from '../util/util'
import {getWxAvatar} from '../api/login'
import {accessView} from '../api/common'

export default {
  data() {
    return {
      loginPages: ['orderDetail', 'order', 'payment'],
      loginState:uni.getStorageSync('user-Info'),
      //获取环境变量

    }
  },
  async onLoad() {
    if (!uni.getStorageSync('id-Token') || !uni.getStorageSync('user-Info')) {
      for (let v of this.loginPages) {
        if (location.hash.includes(v)) {
          this.onNavigateToPage('index')
        }
      }
    }
  },
  methods: {
    //获取图片地址
    async getUrlView(url) {
      if (!url.trim()) return
      let req = {
        path: url.trim(),
        role: 'viewerRole'
      }
      if (url.includes('https://')) {
        return
      }
      const res = await accessView(req)
      let region = 'oss-cn-chengdu'
      let url1 = "https://" + res.data?.bucket + "." + region + ".aliyuncs.com/" +
        res.data.objectName;
      return url1.includes('gif') ? await this.urlToBase64Async(url1) : url1
    },
    urlToBase64Async(url) {
      return new Promise((resolve, reject) => {
        this.urlToBase64(url, (data) => {
          resolve(data)
        })
      })
    },
    urlToBase64(url, callback = null) {
      let image = new Image()
      image.setAttribute('crossOrigin', 'Anonymous')
      image.src = url + '?v=' + Math.random()
      let that = this
      image.onload = function () {
        let dataURL = that.imageToBase64(image)
        if (callback) {
          callback(dataURL)
        }
      }
    },
    imageToBase64(image) {
      let canvas = document.createElement('canvas')
      let width = image.width
      let height = image.height

      canvas.width = width
      canvas.height = height
      let context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, width, height)
      return canvas.toDataURL('image/png')
    },
    copyValue(text) {
        uni.setClipboardData({
        data: text,
        success: () => {
          uni.$u.toast('复制成功')
        }, fail: (err) => {
          console.log(err)
        }
      });
    },
    transformData(data) { //[object Object]
      let transformData
      let type = Object.prototype.toString.call(data)
      if (type === '[object Object]') {
        transformData = {}
        for (let i in data) {
          transformData[i] = data[i].text
        }
      } else {
        if (data.length === 0) return []
        transformData = []
        for (let v of data) {
          let jsonData = {}
          for (let index in v) {
            jsonData[index] = v[index].text
          }
          transformData.push(jsonData)
        }
      }
      return transformData
    },
    onNavigateToPage(name = '', params = {}, query = {}) {
      //用于处理跳转时修改红点参数
      const res = uni.getStorageSync('red-dot')
      const temp = res;
      if(res) {
        res.forEach((item, index) => {
          if (item['id'] === query['dot']) {
            temp[index]['temp'] = false
          }
        })
        uni.setStorageSync('red-dot', temp)
      }
      this.$Router.push({name, params})
    }
  }
}
