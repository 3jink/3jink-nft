import axios from '@/util/request'


function checkLogin() {
  return new Promise((resolve, reject) => {
    uni.checkSession({
      success() {
        console.log(`e`);
        resolve({code: 0})

      },
      async fail() {
        try {
          let loginRes = await login()
          resolve(loginRes)
        } catch (e) {
          reject(e)
        }
      },
    });
  })
}


function login() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'toutiao',
      success: res => {
        let codeObj = res;
        uni.getUserInfo({
          success: async res => {
            try {
              let loginRes = await axios.post('https://tt.yugetj.com/api/User/Login', {...codeObj, ...res.userInfo})
              uni.setStorageSync('openid', loginRes.data.data.openid);
              uni.setStorageSync('session_key', loginRes.data.data.sessionKey)
              resolve({
                ...res
              })
            } catch (e) {
              reject(e)
            }
          },
          fail(e) {
            reject(e)
          }
        })
      }
    })
  })
}

//格式化表格数据
function tableRowFormat(data) {
  const dataList = data.data.rows || []
  let list = []
  dataList.forEach((item, index) => {
    let jsonData = {}
    for (let key in item) {
      jsonData[key] = item[key].text
    }
    list.push(jsonData)
  })
  data.data.list = list
  return data
}

/*
* @param 第一个参数传递代表本月
* @param 第二个参数传递代表本季度
*
* 1*/
function getMonth(type = 'curr', quarter) {
  let date = new Date()
  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
  let nextMonth = (date.getMonth() + 2) > 9 ? (date.getMonth() + 2) : '0' + (date.getMonth() + 2)
  let fullYear = date.getFullYear() + ''
  if (!quarter) {
    return fullYear + '-' + (type === 'curr' ? month : nextMonth) + '-01 00:00:00'
  } else {
    let sMonth, eMonth
    if (month >= 1 && month <= 3) {
      sMonth = '01'
      eMonth = '04'
    } else if (month >= 4 && month <= 6) {
      sMonth = '04'
      eMonth = '07'
    } else if (month >= 7 && month <= 9) {
      sMonth = '07'
      eMonth = '10'
    } else {
      sMonth = '10'
      eMonth = '01'
    }
    return (sMonth === '10' && quarter !== 'curr') ? (fullYear + 1) : fullYear + '-' + (quarter === 'curr' ? sMonth + '' : eMonth) + '-01' +
      ' 00:00:00'
  }
}

/*
* @param 第一个参数传递代表之前的时间戳
* @param 第二个参数传递代表之后的时间戳
* */
function getRelativeTime(beforeTime, afterTime) {
  let minute = '00'
  let second = '00'

  let date = new Date(beforeTime)
  let now = date.getTime()
  let endDate = new Date(afterTime)
  let end = endDate.getTime()
  let leftTime = end - now
  let m = null
  let s = null
  if (leftTime >= 0) {
    m = Math.floor(leftTime / 1000 / 60 % 60)
    s = Math.floor(leftTime / 1000 % 60)
    minute = m < 10 ? '0' + m : m
    second = s < 10 ? '0' + s : s
  }
  return minute + ":" + second
}

/*
* 检查是否微信环境
* */
function isWxOpen() {
  let ua = window.navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i)?.toString() === 'micromessenger' || ua.match(/_SQ_/i)?.toString() === '_sq_';
}

/*
* urlEncode
* */

function urlEncode(str) {
  let res = "";
  let strSpec = "!\"#$%&'()*+,/:;<=>?[]^`{|}~%";
  let text = "";

  for (let i = 0; i < str.length; i++) {
    let chr = str.charAt(i);
    let c = str2ASCII(chr);
    text += chr + ":" + c + "n";
    if (parseInt("0x" + c) > 0x7f) {
      res += "%" + c.slice(0, 2) + "%" + c.slice(-2);
    } else {
      if (chr === " ") res += "+";
      else if (strSpec.indexOf(chr) !== -1) res += "%" + c.toString();
      else res += chr;
    }
  }
  return res;
}

function str2ASCII(val) {
  return ("0" + val.charCodeAt(0).toString(16)).slice(-2);
}

/*
* 获取重定向地址
* */

function redirectUrl(orderId) {
  let env = process.env.NODE_ENV
  let url = `${process.env.VUE_APP_BASE_URL}/pages/order/Detail?orderId=${orderId}&paid=true`
  return urlEncode(url)
}

/*
 * 获取url参数
 * return 数组形式返回截取的字段
 */
function getUrlParam() {
  const halfUrl = location.href.split('?')[1]
  if (!halfUrl) return
  let urlArr;
  if (halfUrl.indexOf('&') !== -1) {
    urlArr = halfUrl.split('&')
    let returnArr = [];
    urlArr.forEach((item, index) => {
      let temp = item.split('=')
      const obj = {}
      obj[temp[0]] = temp[1]
      returnArr.push(obj)
    })
    return returnArr
  } else {
    urlArr = halfUrl
    const resultArr = urlArr.split('=')
    const obj = {}
    obj[resultArr[0]] = resultArr[1]
    return [obj]
  }
}

/*
 * 删除url指定参数
 */

// 删除url中某个参数,并跳转
// function funcUrlDel() {
//   return  location.href.split('?')[0]
// }
function funcUrlDel(url, params) {
  for (var index = 0; index < params.length; index++) {
    var item = params[index];
    var fromIndex = url.indexOf(item + "="); //必须加=号，避免参数值中包含item字符串
    if (fromIndex !== -1) {
      // 通过url特殊符号，计算出=号后面的的字符数，用于生成replace正则
      var startIndex = url.indexOf("=", fromIndex);
      var endIndex = url.indexOf("&", fromIndex);
      var hashIndex = url.indexOf("#", fromIndex);

      var reg = "";
      if (endIndex !== -1) {
        // 后面还有search参数的情况
        var num = endIndex - startIndex;
        reg = new RegExp(item + "=.{" + num + "}");
        url = url.replace(reg, "");
      } else if (hashIndex !== -1) {
        // 有hash参数的情况
        var num = hashIndex - startIndex - 1;
        reg = new RegExp("&?" + item + "=.{" + num + "}");
        url = url.replace(reg, "");
      } else {
        // search参数在最后或只有一个参数的情况
        reg = new RegExp("&?" + item + "=.+");
        url = url.replace(reg, "");
      }
    }
  }
  var noSearchParam = url.indexOf("=");
  if (noSearchParam === -1) {
    url = url.replace(/\?/, ""); // 如果已经没有参数，删除？号
  }
  return url;
}


module.exports = {
  checkLogin: checkLogin,
  login: login,
  tableRowFormat,
  getMonth,
  getRelativeTime,
  isWxOpen,
  urlEncode,
  redirectUrl,
  getUrlParam,
  funcUrlDel
}
