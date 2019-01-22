<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
    font-family: Monteserrat Regular; /* 'Avenir', Helvetica, Arial, sans-serif;*/
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ffffff;
    text-align: center;
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
</style>
