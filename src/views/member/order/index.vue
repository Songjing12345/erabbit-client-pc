<template>
<div class="member-order">
<!--  tab组件 jsx-->
  <xtxTabs v-model="activeName" @tab-click="tabClick">
    <xtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name"></xtxTabsPanel>
  </xtxTabs>
<!--  订单列表-->
  <div class="order-list">
    <div v-if="loading" class="loading"></div>
    <div class="none" v-if="!loading && orderList.items.length === 0">暂无数据</div>
    <orderItem
      v-for="item in orderList.items"
      :key="item.id" :order="item"
      @on-cancel="handelCancel"
      @on-delete="handlerDelete"
      @on-confirm="handleConfirm"
      @on-logistics="handlerLogistics"
    >
    </orderItem>
  </div>
<!--  分页组件-->
  <XtxPagination
    v-if="total>0"
    :current-page="reqParams.page"
    :page-size="reqParams.pageSize"
    :total="total"
    @current-change="reqParams.page=$event"
  ></XtxPagination>
  <!-- 取消原因组件 -->
  <OrderCancel ref="orderCancelCom" />
  <!-- 查看物流组件 -->
  <OrderLogistics ref="orderLogisticsCom" />
</div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import orderItem from './components/order-item'
import { findOrderList, delteOrder, confirmOrder } from '@/api/order'
import OrderCancel from './components/order-cancel'
import OrderLogistics from './components/order-logistics'
import Confirm from '@/components/library/confirm'
import Message from '@/components/library/Message'
export default {
  name: 'MemberOrder ',
  components: { orderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')
    // 获取数据
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)
    // 获取订单列表
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        // console.log(data.result)
        orderList.value = data.result
        total.value = data.result.counts
        loading.value = false
      })
    }
    // 监听reqParams数据的变化
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })
    // 点击选项卡
    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }
    // 删除订单
    const handlerDelete = order => {
      Confirm({ text: '您确认删除该条订单吗？' }).then(() => {
        // console.log(order.id)
        delteOrder(order.id).then(() => {
          Message({ text: '删除订单成功', type: 'success' })
          getOrderList()
        })
      }).catch(() => {})
    }
    return {
      activeName,
      tabClick,
      orderStatus,
      orderList,
      loading,
      reqParams,
      total,
      ...useCancel(),
      handlerDelete,
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
// 取消订单逻辑
export const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null)
  // 点击取消
  const handelCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handelCancel, orderCancelCom }
}
// 确认收货逻辑
export const useConfirm = () => {
  const handleConfirm = (order) => {
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        order.orderState = 4
      })
    }).catch(() => {})
  }
  return { handleConfirm }
}
// 查看物流逻辑
export const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = order => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>

<style scoped lang="less">
.member-order {
  height: 100%;
  background: #fff;
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
