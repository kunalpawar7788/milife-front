<template>
<div class="container-header">
  <div class="nav-header">
    <div v-on:click="go_back()">
      <img src="@/assets/images/back-green-button.svg"/>
    </div>
    <div v-on:click="go_to_dashboard()">
        <img :src="dashboard_icon"/>
    </div>
    <div id="sidebar-menu" v-on:click="toggle_menu()">
      <img :src="sidebar_menu_icon" />
    </div>
  </div>
  <div class="sidebar-menu" v-if="sidebar_visible">
    <ul class="menu-list" v-if="isTrainer">
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{ name: 'home'}">Dashboard </router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{ name: 'invite'}">Invite Users </router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'user-list'}">Users</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'upload-csv'}">Upload CSV</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'logout'}">Sign out</router-link>
      </li>
    </ul>
    <ul class="menu-list" v-else>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'home'}">Dashboard </router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'my-details-view'}">Your Details</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'my-programmes'}">Programme Summary</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'my-documents'}">Your Documents</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'log-weight-view-self'}">Log Weight</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'my-progress-chart'}">Charts and Stats</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu" >
        <router-link :to="{name: 'my-mealplan-summary'}">Calorie Breakdown</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'message-list-view'}">Messages</router-link>
      </li>
      <li class="menu-item" v-on:click="hide_menu">
        <router-link :to="{name: 'logout'}">Sign out</router-link>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import store from "@/store";
export default {
    name: "HeaderMenu",

    data() {
        return {
            sidebar_visible: false,
            isTrainer: store.getters['auth/is_staff'],
            original_theme: null,
        }
    },
    methods: {
        go_to_dashboard: function(){
            this.hide_menu();
            this.$router.push({name: 'home'});
        },
        go_back: function(){
            this.hide_menu();
            this.$router.go(-1);
        },
        hide_menu: function(){
            var original_theme = this.original_theme;
            this.$store.dispatch('theme/set_theme', {original_theme});
            this.sidebar_visible = false;
        },
        toggle_menu: function(){
            if (!this.sidebar_visible){
                this.original_theme = this.$store.state.theme.theme;
                this.sidebar_visible = true;
                this.$store.dispatch('theme/set_theme_blue');
            }
            else
                this.hide_menu();
        },
    },

    computed: {
        theme: {
            get() {return this.$store.state.theme.theme;},
        },
        sidebar_menu_icon:{
            get() {
                if (this.sidebar_visible)
                    return require("@/assets/images/menu-dark-close.svg");
                if (this.theme=='blue')
                    return require("@/assets/images/menu-white.svg");
                else
                    return require("@/assets/images/menu-dark.svg");


            }
        },
        dashboard_icon: {
            get() {
                if (this.theme=='blue')
                    return require("@/assets/images/dashboard-white.svg");
                else
                    return require("@/assets/images/dashboard-dark.svg");

            }
        }
    },

}

</script>

<style lang="scss">
.container-headermenu {
    border: 1px solid white;
}
.nav-header{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    padding: 10px;
    margin-bottom: 10px;
}
.sidebar-menu {
    border: 1px solid white;
    text-align: left;
    z-index: 10;
    position: absolute;
    top: 520;
    left: 0;
    background-color: $milife-blue;
    width: 99%;
    height: 90%;

}

button {
    all: unset;
}

.menu-list{
list-style: none;
}

.menu-item{
    padding: 10px;
}

a, u {
    text-decoration: none !important;
    color: white;
}
</style>
