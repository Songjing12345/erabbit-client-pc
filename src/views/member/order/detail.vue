<template>
<div class="member-order-detail" v-if="order">
<!--  头部-->
  <DetailAction :order="order" />
<!--  进度-->
  <DetailSteps :order="order" />
<!--  物流-->
  <Suspense>
    <!-- 组件加载完毕 -->
    <template #default>
      <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order="order" />
    </template>
    <!-- 组件加载中显示 -->
    <template #fallback>
      <div class="loading">loading...</div>
    </template>
  </Suspense>
<!--  信息-->
  <OrderInfo :order="order" />
</div>
</template>

<script>
import DetailAction from './components/detail-action'
import DetailSteps from './components/detail-steps'
import DetailLogistics from './components/detail-logistics'
import OrderInfo from './components/order-info'
import { useRoute } from 'vue-router'
import { findOrder } from '@/api/order'
import { ref } from 'vue'
export default {
  name: 'MemberDetail',
  components: { DetailAction, DetailSteps, DetailLogistics, OrderInfo },
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}
</script>

<style scoped lang="less">
.member-order-detail {
  height: 100%;
  background: #fff;
}
</style>
