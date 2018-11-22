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
      { path: '/login', component: Login, name: 'login'},
      { path: '/register', component: Registration, name: 'register'},
      { path: '/logout', component: Logout, name: 'logout'},
      { path: '/change-password', component: ChangePassword, name: "changepassword", meta: {requiresAuth: true}},
      { path: '*', component: NotFoundComponent },
  ]
}
)

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters['auth/isLoggedIn']) {
            next()
            return
        }
        next('/login') 
    } else {
        next() 
    }
})

export default router;
