import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/loginView.vue'
const routes = [
    { path: '/', redirect: '/login' }, // 重定向根路径到/login
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        // meta: { requiresAuth: false } // 标记该路由无需认证s
    },
    {
        path: '/homeView',
        name: 'homeView',
        component: () => import('../views/homeView.vue'),
        meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
        path: '/aiHelper',
        name: 'aiHelper',
        component: () => import('../views/aiHelper/index.vue'),
        // meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
        path: '/info',
        name: 'info',
        component: () => import('../views/detailInfo.vue'),
        meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
        path: '/retrieve',
        name: 'retrieve',
        component: () => import('../views/retrieveMain.vue'),
        meta: { requiresAuth: true } // 需要登录才能访问
    },  
]
 
const router = createRouter({ //用于创建路由实例，接收配置对象作为参数
  history: createWebHistory(),//启用 HTML5 历史模式（无 # 的 URL）
                              //需服务器配置支持，否则刷新会 404
                              //替代方案：createWebHashHistory()（带 # 的哈希模式
  routes  //定义路由规则的数组，包含 path、component 等属性
})
 
export default router