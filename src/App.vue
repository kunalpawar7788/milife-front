<template>
<div
id="app"
:class="[theme=='blue'?'bluebackground':'whitebackground']"
>
    <HeaderMenu v-if="this.isAuthenticated"></HeaderMenu>
    <router-view/>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderMenu from '@/components/HeaderMenu.vue';
import store from '@/store'
export default {

    data() {
        console.log('flag', store.getters['auth/isUserEmailVerified']);
        return {
            showEmailVerification: !store.getters['auth/isUserEmailVerified'],
            isAuthenticated: store.getters['auth/isAuthenticated'],
            isTrainer: store.getters['auth/is_staff'],
        }
    },
    computed: {
        theme: {
            get() {return this.$store.state.theme.theme;},
        }
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
    font-family: Monteserrat Regular; /* 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ffffff;
    text-align: center;
    padding:8px;
    margin: 0;
    min-height: 100%;

}
.button{
    background-color: #8AC53F;
    border: None;
    border-radius: 50px;
    padding: 25px;
    color: grey;
    font-size: 15pt;
    &:hover {
        color: white;
    }

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
