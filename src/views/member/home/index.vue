<template>
  <div class="member-home">
    <!--    概览组件-->
    <MemberHomeOverview></MemberHomeOverview>
    <!--    收藏-->
    <HomePanel title="我的收藏">
      <GoodsItem v-for="goods in collectGoods" :key="goods.id" :goods="goods" />
    </HomePanel>
    <!--    足迹-->
    <HomePanel title="我的足迹">
      <GoodsItem v-for="i in 4" :key="i" :goods="goods" />
    </HomePanel>
    <!--    猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>
<script>
import MemberHomeOverview from './components/home-overview'
import HomePanel from './components/home-panel'
import GoodsItem from '@/views/category/components/goods-item'
import GoodsRelevant from '@/views/goods/components/goods-relevant'
import { findCollect } from '@/api/member'
import { ref } from 'vue'
export default {
  name: 'MemberHome',
  components: { MemberHomeOverview, HomePanel, GoodsRelevant, GoodsItem },
  setup () {
    // 调用模拟的接口
    const collectGoods = ref([])
    findCollect({ page: 1, pageSize: 4 }).then(data => {
      // console.log(data)
      collectGoods.value = data.result.items
    })
    const goods = {
      id: '1',
      name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
      picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
      desc: '清汤鲜香 红汤劲爽',
      price: '159.00'
    }
    return { collectGoods, goods }
  }
}
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
