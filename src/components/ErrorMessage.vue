<template>
  <div class="errormessage">{{error_message}}</div>
</template>

<script>
export default {
name: "ErrorMessage",
props: ["error_message"],
}
</script>

<style lang="scss">
  .errormessage{
  color: $milife-magenta;
  margin-top: 10px;
  }
</style>
