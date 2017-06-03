import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello'
import Index from '../components/Index'
import Settle from '../components/Settle'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Hello
    },
    {
      path: '/index',
      component: Index
    },
    {
      path: '/settle',
      component: Settle
    }
  ]
})
