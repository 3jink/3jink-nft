import {BasicLayout, BlankLayout, PageView, RouteView} from '@/layouts'
import {NFT, Goods, Tenant, User, Order, Account, Data, Active} from '@/core/icons'
import router from '../router/index'
import storage from 'store'

let jwt = require('jsonwebtoken')//引入jwt解析token
// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,


  //业务开始
  NFTLibrary: () =>
    import( /* webpackChunkName: "result" */ '@/views/NFT/Library'),
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}


/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = token => {
  return new Promise((resolve, reject) => {

    const nav = []
    const resData = jwt.decode(storage.get('id-Token'))
    const permission = resData?.ProfileNo
    // 根级菜单
    let rootRouter = {
      key: '',
      name: 'index',
      path: '',
      component: 'BasicLayout',
      redirect: '/NFT/library',
      meta: {
        title: '首页'
      },
      children: []
    }
    if (permission.includes('management_supper_admin')|| permission.includes('management_admin') ) {
      nav.push(
        //业务开始
        {
          name: 'NFT',
          parentId: 0,
          id: 1,
          meta: {
            icon: NFT,
            title: 'NFT',
            show: true
          },
          path: '/NFT/library',
          component: 'NFTLibrary',
        },
        {
          name: 'goods',
          parentId: 0,
          id: 3,
          meta: {
            icon: Goods,
            title: '商品',
            show: true
          },
          // path: '/goods/list',
        },
        {
          name: 'list',
          parentId: 3,
          id: 4,
          meta: {
            icon: Goods,
            title: '藏品',
            show: true
          },
          path: '/goods/list',
        },
        {
          name: 'merchant',
          parentId: 0,
          id: 5,
          meta: {
            icon: Tenant,
            title: '商户管理',
            show: true
          },
          path: '/merchant/merchantManage',
        },
        {
          name: 'user',
          parentId: 0,
          id: 7,
          meta: {
            icon: User,
            title: '用户管理',
            show: true
          },
          path: '/user/userManage',
        },
        {
          name: 'advertisement',
          parentId: 0,
          id: 8,
          meta: {
            icon: User,
            title: '广告',
            show: true
          },
          path: '/advertisement/manage'
        },
        {
          name: 'order',
          parentId: 0,
          id: 9,
          meta: {
            icon: Order,
            title: '订单记录',
            show: true
          },
          path: '/order/record',
        }
      )
    } else if (permission.includes('management_merchant_admin')) {
      nav.push(
        //业务开始
        {
          name: 'NFT',
          parentId: 0,
          id: 1,
          meta: {
            icon: NFT,
            title: 'NFT',
            show: true
          },
          path: '/NFT/library',
          component: 'NFTLibrary',
        },
        {
          name: 'goods',
          parentId: 0,
          id: 3,
          meta: {
            icon: Goods,
            title: '商品',
            show: true
          },
        },
        {
          name: 'list',
          parentId: 3,
          id: 4,
          meta: {
            icon: Goods,
            title: '藏品',
            show: true
          },
          path:'/goods/List'
        },
        {
          name: 'order',
          parentId: 0,
          id: 9,
          meta: {
            icon: Order,
            title: '订单记录',
            show: true
          },
          path: '/order/record',
        },
        {
          name: 'setting',
          parentId: 0,
          id: 14,
          meta: {
            icon: Tenant,
            title: '商户设置',
            show: true
          },
          path: '/tenant/Detail',
        },
      )
    }
    const menuNav = []
    const childrenNav = []
    //      后端数据, 根级树数组,  根级 PID
    listToTree(nav, childrenNav, 0)
    rootRouter.children = childrenNav
    menuNav.push(rootRouter)
    storage.set('all-path', menuNav)
    const routers = generator(menuNav)
    routers.push(notFoundRouter)
    resolve(routers)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const {title, show, hideChildren, hiddenHeaderContent, target, icon} = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: constantRouterComponents[item.component || item.key] || (() =>
        import(`@/views/${item.component}`)),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}