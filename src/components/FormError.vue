<template>
    <span class="help-block">
          <slot></slot>
    </span>
</template>

<script>

  export default {
  name: 'FormError',
  props: ['errors'],
    }
</script>

<style>
  .help-block{
    color: $milife-magenta;
  margin-top: 10px;

  }
<style>
