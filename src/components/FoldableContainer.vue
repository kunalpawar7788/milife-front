<template>
<div class="foldable-container bg-lightgrey  br-10">
  <header   v-on:click="toggle">
    <div for="" class="fn-18 fw-600 float-left fc-black">{{label}}</div>
    <div class="float-right fn-18 fw-600 fc-blue">
      <template v-if="!collapsed"> - </template>
      <template v-else > + </template>
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
    components: {
        
    },
    props: {
        label: String,
    },
    computed: {
        
    },
    methods: {
        toggle: function(){
            this.collapsed = !this.collapsed;
        },
    },
    mounted(){

    },

}
</script>

<style lang="scss">
.foldable-container{
    header {
        height: 30px;
        padding: 10px;
    }
}
</style>
