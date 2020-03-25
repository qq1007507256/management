import Vue from 'vue'
import VueRouter from 'vue-router'


import login from '../components/login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)
const routes=[
    {
         path:'/',
         redirect: '/login'
    },
   {
       path:'/login',
       component:login
   },
   {
       path:'/Home',
       component:Home
   } 
]


const router=new VueRouter({
    routes,
    mode:'history'
})

router.beforeEach((to, from, next) => {
    if(to.path==='/login') return next();
    
    const tokenStr=window.sessionStorage.getItem('token');
    console.log(tokenStr);
    if(!tokenStr) return next('/login');
    next()
})


export default router