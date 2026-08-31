import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'AppStart',
    meta: { title: '开始' },
    component: () => import('@/views/AppStart')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { title: '仪表盘' },
    component: () => import('@/views/DashboardPage')
  },
  {
    path: '/list',
    name: 'List',
    meta: { title: '我的资产' },
    component: () => import('@/views/ListPage'),
    children: [
      {
        path: 'review/:id?', name: 'review',  
        meta: { title: '我的资产', childTitle: '查看资产' },
        component: () => import('@/views/ListPage/ListReview.vue')
      }
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    meta: { title: '设置' },
    component: () => import('@/views/SettingPage'),
    children: [
      { 
        path: 'darkmode', name: 'darkmode',
        meta: { title: '设置', childTitle: '深色模式' },
        component: () => import('@/views/SettingPage/SetDarkMode')
      }
    ]
  },
  {
    path: '/add',
    name: 'Add',
    meta: { title: '添加资产' },
    component: () => import('@/views/AddPage')
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    meta: { title: '编辑资产' },
    component: () => import('@/views/EditPage')
  }
]

const router = new VueRouter({
  routes
})

// 解决重复跳转相同路由时抛出的 NavigationDuplicated 错误
// （如已在 /add 页再次点击进入 /add），同时保留对其他真实导航错误的提示
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => {
    if (err.name !== 'NavigationDuplicated') throw err
  })
}

export default router
