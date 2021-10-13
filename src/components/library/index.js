// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import defaultImg from '@/assets/images/200.png'
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBreadItem from './xtx-bread-item.vue'

// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)
// console.dir(importFn.keys()) 文件名称数组

export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // 批量注册全局组件
    // keys()获取所有的文件路径
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })

    // 定义指令
    defineDirective(app)
  }
}
// 指令
const defineDirective = (app) => {
  // 图片懒加载指令
  // directive自定义指令,对普通 DOM 元素进行底层操作
  app.directive('lazyload', {
    // el 是图片元素  binding.value 图片地址
    mounted (el, binding) {
      // 创建观察对象实例
      // callback 被观察dom进入可视区离开可视区都会触发
      // 两个回调参数entries,observer
      // - entries 被观察的元素信息对象的数组 [{元素信息},{}]，信息中isIntersecting判断进入或离开
      // - observer 就是观察实例
      // options 配置参数
      // - 三个配置属性 root rootMargin threshold
      // - root 基于的滚动容器，默认是document
      // - rootMargin 容器有没有外边距
      // - threshold 交叉的比例
      // 实例提供两个方法
      // observe(dom) 观察哪个dom
      // unobserve(dom) 停止观察那个dom
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 取消观察
          observer.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0.01
      })
      // 进行观察
      observer.observe(el)
    }
  })
}
