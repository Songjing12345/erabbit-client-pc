<template>
<!--顶部通栏-->
  <AppTopNav></AppTopNav>
<!--头部组件-->
  <AppHeader></AppHeader>
<!--  头部吸顶组件-->
  <AppHeaderSticky></AppHeaderSticky>
  <!--  内容容器-->
  <div class="app-body">
<!--    二级路由-->
    <router-view/>
  </div>
<!--底部组件-->
  <AppFooter></AppFooter>
</template>

<script>
import AppTopNav from '@/components/app-topnav'
import AppHeader from '@/components/app-header'
import AppFooter from '@/components/app-footer'
import AppHeaderSticky from '@/components/app-header-sticky'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppTopNav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  // 获取分类数据
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang="less">
.app-body {
  min-height: 600px;
}

</style>
