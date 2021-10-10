import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
]

// vue2.0 创建路由 new VueRouter({})
// vue3.0 创建路由 createRouter({})
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
