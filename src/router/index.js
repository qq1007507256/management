import Vue from 'vue'
import VueRouter from 'vue-router'


import login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/user.vue'

Vue.use(VueRouter)
const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/Home',
        component: Home,
        redirect:'/Welcome',
        children:[{
            path:'/Welcome',
            component:Welcome
        },
    {
        path:'/users',
        component:User

    }
    ]
    }
    
]


const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next()
})


export default router