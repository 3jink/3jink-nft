import city from './city'
import moment from 'moment'
import storage from 'store'
import jwt from 'jsonwebtoken'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {
  }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE() {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function scorePassword(pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += (variations[check] === true) ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score)
}

//根据后台返回省市区code得到字符串
export function getCityString(code) {
  for (let i in city) {
    if (city[i].value===code) {
      return city[i].label
    } else {
      for (let j in city[i].children) {
        if (city[i].children[j].value===code) {
          return city[i].children[j].label
        } else {
          for (let k in city[i].children[j].children) {
            if (city[i].children[j].children[k].value===code) {
              return city[i].children[j].children[k].label
            }
          }
        }
      }
    }
  }
  return ''
}

//将后端返回的平级结构转化为树
export function exchangeTree(array, id = 'id', parentId = 'parent_id') {
  //处理是子节点的删除掉
  let arr = array.data.list
  //arr.list就是这个平级
  let info = arr.reduce((map, node) => {
    return map[node[id]] = node, node.children = [], map
  }, {})
  // 最后list就是我们转换成功的树结构
  arr.filter(node => {
    if (info[node[parentId]]) {
      // 将对应的node放入对应的对象里面去，因为它是浅拷贝，所以会影响原来的数组
      // 进而组装成一个树结构，这块大家打印出来看看就明白了了
      info[node[parentId]].children.push(node)
    }
    // 将没parentId的node返回组成一个新数组
    // 没有parentId代表着它是根元素
    return !node[parentId]  // 为 true会返回这个数据，为false则不会返回
  })


  let len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i][id]===arr[j][parentId]) {
        arr.splice(j, 1)
        len--
        j--
      }
    }
  }
  return arr
}


//getCurrentDate(){}
export function getMomentDate(time) {
  if (!time) return ''
  let month = new Date(time).getMonth() < 9 ? '0' + (new Date(time).getMonth() + 1) : new Date(time).getMonth() + 1
  let date = new Date(time).getDate(time) < 9 ? '0' + (new Date(time).getDate() + 1) : new Date(time).getDate(time) + 1
  let newTime = new Date(time).getFullYear() + '-' + month + '-' + date
  return moment(newTime).format('YYYY-MM-DD HH:mm:ss')
}

//获取权限相关
export function getPermission(time) {
  const claim = jwt.decode(storage.get('id-Token'))
  const permission = claim.ProfileNo.split(',')
  if(permission.indexOf('management_supper_admin')!==-1){
    return true
  }else{
    return false
  }
}