import Login from '@/pages/Login'
import Home  from '@/pages/Home'

export default [
    /**
     * 登录
     */
    {
        path: '/login',
        name:'Login',
        component: Login,
        meta: { requiresGuest: true }, // 需要未登录
    },
    /**
     * 首页
     */
    {
        path: '/',
        name:'Home',
        component: Home,
        meta: { requiresAuth: true }, // 需要身份验证
    }
]