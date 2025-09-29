import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import modal from './modal'
import * as echarts from 'echarts' // 大屏

export default function installPlugins(app) {
  //消除浏览器的警告
  app.config.warnHandler = () => null

  app.config.globalProperties.$echarts = echarts
  app.config.globalProperties.$modal = modal

  //全局注册图标组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}
