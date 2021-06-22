import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import MyFile from '../components/MyFile.vue'
import Upload from '../components/Upload.vue'
import Search from '../components/Search.vue'
import OPESearch from '../components/OPESearch.vue'
import Decrypt from '../components/Decrypt.vue'




Vue.use(VueRouter)


const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/home',
    component:Home,
    redirect: 'welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/myfile',
        component: MyFile
      },
      {
        path: '/uploadview',
        component: Upload
      },
      {
        path: '/searchview',
        component: Search
      },
      {
        path: '/decrypt',
        component: Decrypt
      },
      {
        path: '/opesearch',
        component: OPESearch
      }
    ]
  }


]

const router = new VueRouter({
  routes
})

/* 挂载路由导航守卫 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  let tokenStr = window.sessionStorage.getItem('token')
  /*  本地是否存有token */
  if (tokenStr !== null && tokenStr !== 'undefined') {
    return next()
  } else {
    next('/login')
  }
})

export default router
