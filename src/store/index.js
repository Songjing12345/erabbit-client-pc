import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'

// vue2.0 创建仓库 new Vuex.Store({})
// vue3.0 创建仓库 createStore({})
export default createStore({
  modules: {
    user,
    cart,
    category
  },
  // 配置插件
  plugins: [
    // 默认存储在localStorage中， 配置持久化
    createPersistedState({
      // 本地存储名字
      key: 'erabbit-client-pc-store',
      // 指定需要存储的模块
      paths: ['user', 'cart']
    })
  ]
})
