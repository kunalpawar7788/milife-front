<template>
<div class="foldable-container bg-lightgrey  br-10">
  <header v-on:click="toggle">
    <div for="" class="fw-600 float-left fc-black">{{label}}</div>
    <div class="float-right fn-18 fw-600 fc-blue">
      <template v-if="!collapsed"> - </template>
      <template v-else> + </template>
    </div>
  </header>
  <slot v-if="!collapsed"></slot>
</div>
</template>

<script lang="js">

export default {
    name: "FoldableContainer",
    data(){
        return {
            status: '',
            collapsed: true,
        };
    },
    props: {
        label: String,
    },
    methods: {
        toggle: function(){
            this.collapsed = !this.collapsed;
        },
    },
    mounted(){
        this.$store.dispatch("theme/set_theme_white");
    },
}
</script>

<style lang="scss">
.foldable-container{
    margin: 15px;
    padding: 15px;

    header {
        height: 30px;
        line-height: 1.3em;
        font-size: 21px;
    }
}
</style>
