import Vue from 'vue';
import Router from 'vue-router';

import store from './store';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Logout from './views/Logout.vue';
import Registration from './views/Registration.vue';
import ChangePassword from './views/ChangePassword.vue';
import NotFoundComponent from './views/NotFoundComponent.vue';
import Invitation from './views/Invitation.vue';
import Unauthorized from '@/views/Unauthorized.vue';
//import ResetPassword from './views/ResetPassword.vue'
//import ConfirmEmail from './views/ConfirmEmail'
import ResetPassword from "@/views/ResetPassword.vue";
import VerifyUserEmail from './views/VerifyUserEmail.vue';
import Profile from '@/views/Profile.vue';
import UserList from '@/views/UserList.vue';
import UserDetail from '@/views/UserDetail.vue';
import Test from '@/views/Test.vue';
import ComposeMessage from '@/views/ComposeMessage.vue';
import ManageUser from '@/views/ManageUser.vue';
import UserDocumentList from '@/views/UserDocumentList.vue';
import AddDocument from '@/views/AddDocument.vue';
Vue.use(Router);

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

      { path: '/profile', component: Profile, name: "update-profile", meta: {requiresAuth: true}},
      { path: '/test', component: Test, name: "testview", meta: {requiresAuth: true}},
      { path: '/invite', component: Invitation, name: "invite", meta: {requiresAdmin: true}},
      { path: '/users', component: UserList, name: "user-list", meta: {requiresAdmin: true}},
      { path: '/users/:pk', component: UserDetail, name: "user-detail", meta: {requiresAdmin: true}},
      { path: '/users/:pk/manage', component: ManageUser, name: "user-manage", meta: {requiresAdmin: true}},
      { path: '/users/:pk/compose-message', component: ComposeMessage, name: "user-message", meta: {requiresAdmin: true}},
      { path: '/users/:pk/documents', component: UserDocumentList, name: "user-documents", meta: {requiresAdmin: true}},
      { path: '/users/:pk/documents/add', component: AddDocument, name: "user-document-add", meta: {requiresAdmin: true}},


      { path: '/unauthorized', component: Unauthorized, name: "unauthorized", meta: {requiresAdmin: false}},

      { path: '*', component: NotFoundComponent },

  ]
});

router.beforeEach((to, from, next) => {
    let isLoggedIn = store.getters['auth/isLoggedIn'];
    let isAdmin = store.getters['auth/is_staff'];
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    let requiresAnon = to.matched.some(record => record.meta.requiresAnon);
    let requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);


    if (store.getters['auth/fetch_profile_flag']){
        console.log('dispatching fetch profile from router');
        store.dispatch("auth/fetch_profile");
    }


    if(requiresAuth && !isLoggedIn){
        next('/login');
    }
    if(requiresAnon && isLoggedIn){
        next('/');
    }
    if(requiresAdmin && !isAdmin){
        next('/unauthorized');
    }
    next();
});

export default router;
