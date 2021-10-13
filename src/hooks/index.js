// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 需要
  // 1. 被观察的对象
  // 2. 不同的API函数
  const target = ref(null)
  const result = ref([])
  // stop是停止观察是否进入或移出可视区域的行为
  const { stop } = useIntersectionObserver(
    // target是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
    target,
    // isIntersecting 是否进入可视区域，true是进入 false是移出
    // observerElement 被观察的dom
    ([{ isIntersecting }], observerElement) => {
      // 当进入可视区域时就停止观察，然后再请求数据
      if (isIntersecting) {
        stop()
        // 调用API获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }
    // 配置选项，相交的比例大于0就触发
    // {
    //   threshold: 0
    // }
  )
  // 返回--->数据（dom,后台数据）
  return { target, result }
}
