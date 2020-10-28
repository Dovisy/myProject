import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Right from '../components/power/Right.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Param from '../components/goods/Params.vue'
// import Goods from '../components/goods/Goods.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

//路由懒加载
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Right = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Right.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

const Goods = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Goods.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home', 
    component: Home, 
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path:'/users',component: Users },
      { path:'/rights',component: Right },
      { path:'/roles',component:  Roles},
      { path:'/categories',component:  Cate},
      { path:'/params',component:  Params},
      { path:'/goods',component:  Goods},
      { path:'/goods/add',component:  Add},
      { path:'/orders',component:  Order},
      { path:'/reports',component:  Report},
      
    ]
   }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) => {
   if (to.path ==='/login') return next()
   const tokenStr = window.sessionStorage.getItem('token')
   if (!tokenStr) return next('/login')
   next()

})

export default router

