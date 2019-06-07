import Vue from 'vue';
import Router from 'vue-router';

import store from './store';

// import Home from './views/Home.vue';
// import Login from './views/Login.vue';
// import Logout from './views/Logout.vue';
// import Registration from './views/Registration.vue';
// import ChangePassword from './views/ChangePassword.vue';
// import NotFoundComponent from './views/NotFoundComponent.vue';
// import Invitation from './views/Invitation.vue';
// import Unauthorized from '@/views/Unauthorized.vue';
// //import ConfirmEmail from './views/ConfirmEmail'
// import ResetPassword from "@/views/ResetPassword.vue";
// import VerifyUserEmail from './views/VerifyUserEmail.vue';
// import Profile from '@/views/Profile.vue';
// import UserView from '@/views/users/UserView.vue';
// import UserList from '@/views/users/UserList.vue';
// import UserDetail from '@/views/users/UserDetail.vue';
// import Test from '@/views/Test.vue';
// import GraphTest from '@/views/GraphTest.vue';
// import ComposeMessage from '@/views/ComposeMessage.vue';
// import ManageUser from '@/views/users/ManageUser.vue';
// import DocumentList from '@/views/userdocument/DocumentList.vue';
// import AddDocument from '@/views/userdocument/AddDocument.vue';
// import ViewDocument from '@/views/userdocument/ViewDocument.vue';
// import ProgressChart from '@/views/ProgressChart.vue';
// import MeasurementsForm from '@/views/MeasurementsForm';
// import TargetWeightsView from '@/views/TargetWeightsView.vue';
// import ProgrammeView from "@/views/programme/ProgrammeView.vue";
// import ProgrammeList from '@/views/programme/ProgrammeList.vue';
// import ProgrammeDetail from '@/views/programme/ProgrammeDetail.vue';
// import ProgrammeAddEdit from '@/views/programme/ProgrammeAddEdit.vue';
// import ProgrammeEditSessions from '@/views/programme/ProgrammeEditSessions.vue';
// import HolidayAdd from '@/views/programme/HolidayAdd.vue';
// import BankSessionAdd from '@/views/programme/BankSessionAdd.vue';
// import LogWeightView from '@/views/LogWeightView.vue';
// import AddUserView from '@/views/users/AddUserView.vue';
// import EditUserView from '@/views/users/EditUserView.vue';
// import UploadCSVView from "@/views/UploadCSVView.vue";
// import PendingUserList from "@/views/users/PendingUserList.vue";
// import AddEditMealPlan from "@/views/mealplan/AddEditMealPlan.vue";

const Home =()=> import('./views/Home.vue');
const Login =()=> import('./views/Login.vue');
const Logout =()=> import('./views/Logout.vue');
const Registration =()=> import('./views/Registration.vue');
const ChangePassword =()=> import('./views/ChangePassword.vue');
const NotFoundComponent =()=> import('./views/NotFoundComponent.vue');
const Invitation =()=> import('./views/Invitation.vue');
const Unauthorized =()=> import('@/views/Unauthorized.vue');
const ResetPassword =()=> import("@/views/ResetPassword.vue");
const VerifyUserEmail =()=> import('./views/VerifyUserEmail.vue');
const Profile =()=> import('@/views/Profile.vue');
const UserView =()=> import('@/views/users/UserView.vue');
const UserList =()=> import('@/views/users/UserList.vue');
const UserDetail =()=> import('@/views/users/UserDetail.vue');
const Test =()=> import('@/views/Test.vue');
const GraphTest =()=> import('@/views/GraphTest.vue');
const ComposeMessage =()=> import('@/views/ComposeMessage.vue');
const ManageUser =()=> import('@/views/users/ManageUser.vue');
const DocumentList =()=> import('@/views/userdocument/DocumentList.vue');
const AddDocument =()=> import('@/views/userdocument/AddDocument.vue');
const ViewDocument =()=> import('@/views/userdocument/ViewDocument.vue');
const ProgressChart =()=> import('@/views/ProgressChart.vue');
const MeasurementsForm =()=> import('@/views/MeasurementsForm');
const TargetWeightsView =()=> import('@/views/TargetWeightsView.vue');
const ProgrammeView =()=> import("@/views/programme/ProgrammeView.vue");
const ProgrammeList =()=> import('@/views/programme/ProgrammeList.vue');
const ProgrammeDetail =()=> import('@/views/programme/ProgrammeDetail.vue');
const ProgrammeAddEdit =()=> import('@/views/programme/ProgrammeAddEdit.vue');
const ProgrammeEditSessions =()=> import('@/views/programme/ProgrammeEditSessions.vue');
const HolidayAdd =()=> import('@/views/programme/HolidayAdd.vue');
const BankSessionAdd =()=> import('@/views/programme/BankSessionAdd.vue');
const LogWeightView =()=> import('@/views/LogWeightView.vue');
const AddUserView =()=> import('@/views/users/AddUserView.vue');
const EditUserView =()=> import('@/views/users/EditUserView.vue');
const UploadCSVView =()=> import("@/views/UploadCSVView.vue");
const PendingUserList =()=> import("@/views/users/PendingUserList.vue");
const AddEditMealPlan =()=> import("@/views/mealplan/AddEditMealPlan.vue");
const CheckinForm =()=> import("@/views/CheckinForm.vue");

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

      {path: '/progress-chart', component: ProgressChart, name:'self-progress-chart', meta:{requiresAuth: true}},

      { path: '/add-user', component: AddUserView, name: 'add-user', meta: {requiresAdmin: true}},
      { path: '/upload-csv', component: UploadCSVView, name: 'upload-csv', meta: {requiresAdmin: true}},
      { path: '/sign-up', component: Registration, name: 'sign-up', meta: {requiresAnon: true}},
      //{ path: '/verify-user-email', component: VerifyUserEmail, name: "verification-mail-sent"},
      { path: '/verify-user-email/:token', component: VerifyUserEmail, name: "verify-email-token"},
      { path: '/logout', component: Logout, name: 'logout'},

      { path: '/change-password', component: ChangePassword, name: "change-password"}, // meta: {requiresAuth: true}},
      { path: '/reset-password', component: ResetPassword, name: "reset-password-request", meta: {requiresAnon: true}},
      { path: '/reset-password/:token', component: ResetPassword, name: "reset-password", meta: {requiresAnon: true}},

      { path: '/profile', component: Profile, name: "update-profile", meta: {requiresAuth: true}},
      { path: '/log-weight', component: LogWeightView, name: "log-weight", meta: {requiresAuth: true}},
      { path: '/test', component: Test, name: "testview", meta: {requiresAuth: true}},
      { path: '/graphtest', component: GraphTest, name: "graphtestview", meta: {requiresAuth: false}},
      { path: '/pending-invitations', component: PendingUserList, name: "pending-invitations", meta: {requiresAdmin: true}},
      { path: '/invite', component: Invitation, name: "invite", meta: {requiresAdmin: true}},
      { path: '/users', component: UserList, name: "user-list", meta: {requiresAdmin: true}},
      { path: '/users/:pk',
        component: UserView,
        meta: {requiresAdmin: true},
        children:[
            {path: '', component: UserDetail, name: "user-detail"},
            { path: 'edit', component: EditUserView, name: "user-edit", meta: {requiresAdmin: true}},
            { path: 'manage', component: ManageUser, name: "user-manage", meta: {requiresAdmin: true}},
            { path: 'target-weights', component: TargetWeightsView, name: "target-weights", meta: {requiresAdmin: true}},
            { path: 'compose-message', component: ComposeMessage, name: "compose-message", meta: {requiresAdmin: true}},
            { path: 'documents', component: DocumentList, name: "user-documents", meta: {requiresAdmin: true}},
            { path: 'documents/:doc_pk/edit', component: AddDocument, name: "user-document-edit", meta: {requiresAdmin: true}},
            { path: 'documents/:doc_pk', component: ViewDocument, name: "user-document-view", meta: {requiresAdmin: true}},
            { path: 'documents/add', component: AddDocument, name: "user-document-add", meta: {requiresAdmin: true}},
            { path: 'progress-chart', component: ProgressChart, name: "progress-chart", meta: {requiresAdmin: true}},
            { path: 'add-checkin', component: CheckinForm , name: "add-checkin", meta: {requiresAdmin: true}},
            { path: 'programmes', component: ProgrammeList, name: "programme-list", meta: {requiresAdmin: true}},
            { path: 'programmes/add', component: ProgrammeAddEdit, name: "programme-add", meta: {requiresAdmin: true}},
            { path: 'log-weight', component: LogWeightView, name: "admin-log-weight", meta: {requiresAuth: true}},
            { path: 'mealplan', component: AddEditMealPlan, name: "mealplan-edit", meta: {requiresAuth: true}},
            { path: 'programmes/:programme_pk',
              component: ProgrammeView,
              meta: {requiresAdmin: true},
              children: [
                  { path: '', component: ProgrammeDetail, name: "programme-detail", meta: {requiresAdmin: true}},
                  { path: 'edit', component: ProgrammeAddEdit, name: "programme-edit", meta: {requiresAdmin: true}},
                  { path: 'edit-sessions', component: ProgrammeEditSessions, name: "programme-edit-sessions", meta: {requiresAdmin: true}},
                  { path: 'holidays/add', component: HolidayAdd, name: "programme-holiday-add", meta: {requiresAdmin: true}},
                  { path: 'banksessions/add', component: BankSessionAdd, name: "programme-banksession-add", meta: {requiresAdmin: true}},


              ]
            },


        ]
      },


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
