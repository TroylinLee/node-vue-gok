import Vue from 'vue'
import VueRouter from 'vue-router'

// const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
const Main = () => import(/* webpackChunkName: "Main" */ '../views/Main')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
]

const router = new VueRouter({
  routes
})

export default router
