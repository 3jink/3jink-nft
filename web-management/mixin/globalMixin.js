import jwt from 'jsonwebtoken'
import storage from 'store'

export default {
  data() {
    return {
      permission: storage.get('permission'),
      merchantPermission: storage.get('merchant-permission'),
      merId: storage.get('user-info')?.MerchantId !== '0' ? storage.get('user-info')?.MerchantId : false,//
      domainName:process.env.VUE_APP_BASE_URL,
      environment:process.env.NODE_ENV
      // '1552181831791546368',
    }
  },
  created() {
  },
  methods: {
    transformPrice(value) {
      return value ? (value / 100).toFixed(2) : 0.00
    },
    onJumpTo(name, obj) {
     let query = encodeURI(JSON.stringify(obj))
      query = encodeURI(query)
      console.log(query)
      return this.$router.push({name, query})
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
    //获取正整数
    getInteger(target, text, value) {
      let type = Object.prototype.toString.call(Number(value))
      let num = Math.abs(Number(value)).toFixed(0) > 0 ? Math.abs(Number(value)).toFixed(0) : 1
      if (type === '[object Number]') {
        this.$set(target, text, num)
      } else {
        this.$set(target, text, num)
      }
    },
    getPrice(target, text, value) {
      let type = Object.prototype.toString.call(Number(value))
      let num = Math.abs(Number(value)).toFixed(2) > 0 ? Math.abs(Number(value)).toFixed(2) : 0.01
      if (type === '[object Number]') {
        this.$set(target, text, num)
      } else {
        this.$set(target, text, num)
      }
    }
  }
}
