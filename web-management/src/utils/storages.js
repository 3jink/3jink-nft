import storage from 'store'

let storages = {
  /*
  * set 存储方法
  * @ param {String}     key 键
  * @ param {String}     value 值，
  * @ param {String}     expired 过期时间，以毫秒为单位，非必须
  */
  set(key, val, expired) {
    let obj = {
      data: val,
      time: Date.now(),
      expired
    }
    storage.set(key, obj)

  },

  /*
  * set 獲取方法
  * @ param {String}     key 键
  */
  get(key) {
    let val = storage.get(key)
    if (!val) {
      return val
    }
    if (Date.now() - val.time > val.expired) {
      storage.remove(key)
      return undefined
    }

    return val.data
  },
  /*
   * remove 刪除方法
   * @ param {String}     key 键
   */
  remove(key) {
    // localStorage.removeItem(key);
    storage.remove(key)
  }

}
export default storages
