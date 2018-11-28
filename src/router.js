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
//import ResetPassword from './views/ResetPassword.vue'
//import ConfirmEmail from './views/ConfirmEmail'
import ResetPassword from "@/views/ResetPassword.vue"
import VerifyUserEmail from './views/VerifyUserEmail.vue'

Vue.use(Router)

const router = new Router({
//export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/',
          name: 'home',
          component: Home,
          meta: {requiresAuth: true},
      },
      { path: '/login', component: Login, name: 'login', meta: {requiresAnon: true}},
      { path: '/sign-up', component: Registration, name: 'sign-up', meta: {requiresAnon: true}},
      //{ path: '/verify-user-email', component: VerifyUserEmail, name: "verification-mail-sent"},
      { path: '/verify-user-email/:token', component: VerifyUserEmail, name: "verify-email-token"},
      { path: '/logout', component: Logout, name: 'logout'},

      { path: '/change-password', component: ChangePassword, name: "change-password"}, // meta: {requiresAuth: true}},
      { path: '/reset-password', component: ResetPassword, name: "reset-password-request", meta: {requiresAnon: true}},
      { path: '/reset-password/:token', component: ResetPassword, name: "reset-password", meta: {requiresAnon: true}},

      { path: '*', component: NotFoundComponent },

  ]
}
)

router.beforeEach((to, from, next) => {
    let isLoggedIn = store.getters['auth/isLoggedIn']
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    let requiresAnon = to.matched.some(record => record.meta.requiresAnon)


    if (store.getters['auth/fetch_profile_flag']){
        console.log('dispatching fetch profile from router');
        store.dispatch("auth/fetch_profile");
    }


    if(requiresAuth && !isLoggedIn){
        next('/login')
    }
    if(requiresAnon && isLoggedIn){
        next('/')
    }
    next()
})

export default router;
