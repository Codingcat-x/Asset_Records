import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getStoredTheme, setStoredTheme, applyTheme } from '@/utils/theme'
import { getList } from '@/api/item'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAsideCollapse: false, // 导航栏是否折叠
    isReview: false,  // 是否显示预览
    // Setting
    themeMode: getStoredTheme(), // 'light' | 'auto' | 'dark'，默认跟随系统
    liststyle: false,  // true：列表式 false：卡片式
    items: [] // 物品列表，唯一数据源是服务端 list.json（不持久化，见插件注释）
  },
  getters: {
    asideWidth: state => state.isAsideCollapse ? '64px' : '200px',
    // 资产统计：单次遍历算出四项，依赖 state.items，列表变化时自动重算。
    // 计算放在 getter 里（派生数据），各页面通过 mapGetters 取同一份，只算一次。
    summary: state => {
      let count = 0         // 所有资产总数（个数）
      let soldCount = 0     // 已卖出资产总数（个数）
      let totalPrice = 0    // 总价：所有物品购入价之和（含已卖出）
      let totalSellPrice = 0 // 已卖出物品的总售价
      for (const it of state.items) {
        count++
        totalPrice += it.buyPrice || 0
        if (it.isSold) {
          soldCount++
          totalSellPrice += it.sellPrice || 0
        }
      }
      return { count, soldCount, totalPrice, totalSellPrice }
    }
  },
  mutations: {
    TOGGLE_ASIDE_COLLAPSED (state) {
      state.isAsideCollapse = !state.isAsideCollapse
    },
    SET_THEME_MODE (state, mode) {
      if (['light', 'auto', 'dark'].indexOf(mode) === -1) return
      state.themeMode = mode
      setStoredTheme(mode)
      applyTheme(mode)
    },
    SET_REVIEW_SHOW (state, show) {
      state.isReview = show
    },
    SET_ITEMS (state, items) {
      state.items = items
    }
  },
  actions: {
    // 拉取物品列表并写入 state；失败时抛出，由调用方处理错误提示
    async fetchItems ({ commit }) {
      const list = await getList()
      commit('SET_ITEMS', list)
    }
  },
  modules: {
  },
  plugins: [
    // 持久化 Vuex 状态到 localStorage
    // themeMode 由 utils/theme.js 独立持久化（键 theme-mode，配合 index.html
    // 防闪烁脚本与 matchMedia 实时跟随），此处排除，避免双份数据源
    createPersistedState({
      // items 不持久化：列表以服务端 list.json 为唯一数据源，本地快照只会过期
      paths: ['isAsideCollapse', 'liststyle', 'isReview']
    })
  ]
})
