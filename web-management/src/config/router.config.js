// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse, yewu } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [
    {
      path: 'login',
      name: 'login',
      component: () =>
        import( /* webpackChunkName: "user" */ '@/views/account/Login')
    }
  ]
},

  {
    path: '/404',
    component: () =>
      import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  },
//NFT
  {
    name: 'NFT',
    path: '/NFT',
    value:'NTF',
    component: BasicLayout,
    redirect: '/NFT/library',
    hidden: true,
    children: [
      {
        path: '/NFT/library',
        name: 'library',
        value:'NTF',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/NFT/Library')
      },
      {
        path: '/NFT/library/detail',
        value:'NTF详情',
        name:'NTFDetail',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/NFT/Detail')
      }
    ]
  },
  {
    name: 'goods',
    path: '/goods',
    component: BasicLayout,
    redirect: '/goods/list',
    hidden: true,
    children: [
      {
        path: '/goods/list',
        value:'商品',
        name: 'list',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/goods/List')
      },
      {
        path: '/goods/list/detail',
        value:'商品详情',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/goods/Detail')
      }
    ]
  },
  {
    name: 'merchant',
    path: '/merchant',
    component: BasicLayout,
    redirect: '/merchant/merchantManage',
    hidden: true,
    children: [
      {
        path: '/merchant/merchantManage',
        name: 'merchantManage',
        value:'商户管理',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/merchant/Manage')
      },
      {
        path: '/merchant/merchantManage/detail',
        value:'商户详情',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/merchant/Detail')
      }
    ]
  },
  {
    name: 'user',
    path: '/user',
    component: BasicLayout,
    redirect: '/user/userManage',
    hidden: true,
    children: [
      {
        path: '/user/userManage',
        value:'用户管理',
        name: 'userManage',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/user/Manage')
      },
      {
        path: '/user/userManage/detail',
        value:'用户详情',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/user/Detail')
      }
    ]
  },
  {
    name: 'advertisement',
    path: '/advertisement',
    component: BasicLayout,
    redirect: '/advertisement/manage',
    hidden: true,
    children: [
      {
        path: '/advertisement/manage',
        value:'广告',
        name: 'advertisement',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/advertisement/Manage')
      }
    ]
  },
  {
    name: 'order',
    path: '/order',
    component: BasicLayout,
    redirect: '/order/record',
    hidden: true,
    children: [
      {
        path: '/order/record',
        name: 'record',
        value:'订单记录',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/order/Record')
      }
    ]
  },
  {
    name: 'setting',
    path: '/merchant',
    component: BasicLayout,
    redirect: '/merchant/merchantManage',
    hidden: true,
    children: [
      {
        path: '/merchant/Detail',
        name: 'setting',
        value:'数据统计',
        component: () =>
          import( /* webpackChunkName: "fail" */ '@/views/merchant/Detail')
      }
    ]
  },
]