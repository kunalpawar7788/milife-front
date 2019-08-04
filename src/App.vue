<template>
<div
  id="app"
  :class="[theme=='blue'?'bluebackground':'whitebackground',]"
  >
  <vue-progress-bar> </vue-progress-bar>
  <HeaderMenu v-if="this.isAuthenticated"></HeaderMenu>
  <router-view/>
</div>
</template>

<script>
import HeaderMenu from '@/components/HeaderMenu.vue';
import store from '@/store'
export default {

    data() {
        console.log('flag', store.getters['auth/isUserEmailVerified']);
        return {
            showEmailVerification: !store.getters['auth/isUserEmailVerified'],
            isTrainer: store.getters['auth/is_staff'],
        }
    },
    computed: {
        theme: {
            get() {return this.$store.state.theme.theme;},
        },
        isAuthenticated(){
            return store.getters['auth/isAuthenticated'];
        },
    },
    components: {
        HeaderMenu,
    },
    created: function(){
        if (store.getters['auth/fetch_profile_flag']){
            console.log('dispatching fetch profile');
            store.dispatch("auth/fetch_profile");
        }

    }
}
</script>


<style lang="scss">
#app {
    font-family: Montserrat; /* 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ffffff;
    text-align: center;

    margin: 0;
    min-height: 100%;
    /* max-width: 500px; */
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.whitebackground {
    background-color: white;
}

.bluebackground {
    background-color: $milife-blue;
}

</style>
