<template>
<div class="container-header">
  <div class="nav-header">
    <div v-on:click="$router.go(-1)">
      <img src="@/assets/images/back-green-button.svg"/>
    </div>
    <div>
      <router-link :to="{ name: 'home'}">
        <img src="@/assets/images/dashboard-white.svg"/>
      </router-link>
    </div>
    <div id="sidebar-menu" v-on:click="sidebar_visible = !sidebar_visible">
      <img v-if="sidebar_visible" src="@/assets/images/menu-dark-close.svg">
      <img v-else src="@/assets/images/menu-white.svg">
    </div>
  </div>
  <div class="sidebar-menu" v-if="sidebar_visible">
    <ul class="menu-list" v-if="isTrainer">
      <li class="menu-item"><router-link :to="{ name: 'home'}">Dashboard </router-link></li>
      <li class="menu-item"><router-link :to="{ name: 'invite'}">Invite Users </router-link></li>
      <li class="menu-item"><router-link :to="{name: 'user-list'}">Users</router-link></li>
      <li class="menu-item">Upload CSV </li>
      <li class="menu-item"><router-link :to="{name: 'logout'}">Sign out</router-link></li>
    </ul>
    <ul class="menu-list" v-else>
      <li class="menu-item"><router-link :to="{name: 'home'}">Dashboard </router-link></li>
      <li class="menu-item"><router-link :to="{name: 'home'}">Your Details</router-link></li>
      <li class="menu-item"><router-link :to="{name: 'home'}">Programme Summary</router-link></li>
      <li class="menu-item"><router-link :to="{name: 'home'}">Your Documents</router-link></li>
      <li class="menu-item"><router-link :to="{name: 'home'}">Log Weight</router-link></li>
      <li class="menu-item"><router-link :to="{name: 'home'}">Charts</router-link></li>
      <li class="menu-item"><router-link :to="{name: 'home'}">Calorie Breakdown</router-link></li>
      <li class="menu-item"><router-link :to="{name: 'home'}">Report Stats</router-link></li>
      <li class="menu-item"><router-link :to="{name: 'logout'}">Sign out</router-link></li>
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
        }
    },
    methods: {
        toggle_menu: function(){
            this.sidebar_visible = !this.sidebar_visible;
        },
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
