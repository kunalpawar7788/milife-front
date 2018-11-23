import Vue from 'vue'
import Router from 'vue-router'

import store from './store';
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue'
import Registration from './views/Registration.vue'
import ChangePassword from './views/ChangePassword.vue'
import NotFoundComponent from './views/NotFoundComponent.vue'
import Invitation from './views/Invitation.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ConfirmEmail from './views/ConfirmEmail'

Vue.use(Router)

const router = new Router({
//export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/',
          name: 'home',
          component: Home
      },
      { path: '/login', component: Login, name: 'login', meta: {requiresAnon: true}},
      { path: '/register', component: Registration, name: 'register', meta: {requiresAnon: true}},
      { path: '/confirm-email', component: ConfirmEmail, name: "confirm-email", meta: {requiresAuth: true}},
      { path: '/logout', component: Logout, name: 'logout'},

      { path: '/change-password', component: ChangePassword, name: "change-password", meta: {requiresAuth: true}},
      { path: '/forgot-password', component: ForgotPassword, name: "forgot-password", meta: {requiresAnon: true}},
      
      { path: '*', component: NotFoundComponent },

  ]
}
)

router.beforeEach((to, from, next) => {
    let isLoggedIn = store.getters['auth/isLoggedIn']
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    let requiresAnon = to.matched.some(record => record.meta.requiresAnon)

    if(requiresAuth && !isLoggedIn){
        next('/login')
    }
    if(requiresAnon && isLoggedIn){
        next('/')
    }
    next()
    // if(requiresAuth) {
    //     if (isLoggedIn) {
    //         next()
    //         return
    //     }
    //     next('/login')
    // } else if (requiresAnon){
    // }
    // } else {
    //     next() 
    // }
})

export default router;
