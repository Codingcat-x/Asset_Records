import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    name: 'Home',
    component: () => import('@/layout/HomePage')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/layout/SettingPage')
  }
]

const router = new VueRouter({
  routes
})

export default router
