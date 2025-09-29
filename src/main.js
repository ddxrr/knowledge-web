import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { setupStore } from './store'
import plugins from './plugins'
import zhCn from "element-plus/es/locale/lang/zh-cn";

const app = createApp(App);
setupStore(app)
app.use(plugins)
app.use(ElementPlus, { locale: zhCn })
app.use(router);
app.mount('#app');
