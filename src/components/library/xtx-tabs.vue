<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'

export default {
  name: 'xtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // 将从props中传来的modelValue设置成响应式的数据
    const activeName = useVModel(props, 'modelValue', emit)
    // 点击选项卡触发函数
    const tabClick = (name, index) => {
      activeName.value = name
      // 提供一个tab-click自定义事件
      emit('tab-click', { name, index })
    }
    // 给xtx-tabs-panel传值
    provide('activeName', activeName)
    return { activeName, tabClick }
  },
  render () {
    // 获取插槽内容
    const panels = this.$slots.default()
    // console.log(panels)
    // 动态获取数据
    const dynimacPanels = []
    panels.forEach(item => {
      // 静态数据
      if (item.type.name === 'xtxTabsPanel') {
        dynimacPanels.push(item)
      } else {
        // 动态数据
        item.children.forEach(i => {
          dynimacPanels.push(i)
        })
      }
    })
    // 选项卡导航菜单结构
    const nav = <nav>{
      dynimacPanels.map((item, i) => {
        return <a
          onClick={() => this.tabClick(item.props.name, i)}
          class={{ active: item.props.name === this.activeName }}
          href="javascript:;">{item.props.label}
        </a>
      })
    }</nav>
    return <div class="xtx-tabs">{[nav, dynimacPanels]}</div>
  }
}
</script>

<style scoped lang="less">
.xtx-tabs {
    background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
         border-top: 2px solid @xtxColor;
         height: 60px;
         background: #fff;
         line-height: 56px;
       }
    }
  }
}
</style>
