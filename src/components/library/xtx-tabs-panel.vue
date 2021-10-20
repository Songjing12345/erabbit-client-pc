<template>
  <div class="xtx-tabs-panel" v-show="activeName===name">
    <slot></slot>
  </div>
</template>
<script>
import { inject } from 'vue'

export default {
  name: 'xtxTabsPanel',
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [String, Number],
      default: ''
    }
  },
  setup () {
    const activeName = inject('activeName')
    return { activeName }
  }
}
</script>

<style scoped>

</style>
