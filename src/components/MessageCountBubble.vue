<template>
<div class="message-count-bubble">
  <div class="bubble-circle">
    <slot></slot>
  </div>
  <div class="twiddle"> </div>
</div>
</template>

<script>
export default {
    name: "MessageCountBubble",
}
</script>

<style lang="scss">
.message-count-bubble {
    .bubble-circle{
        width:30px;
        height:30px;
        background-color: $milife-magenta;
        border-radius: 50px;
        border: 2px solid white;
        text-align: center;
        vertical-align: middle;
        display: table-cell;
        color: white;
        
    }
    .twiddle{
        width: 10px;
        height: 10px;
        background-color: $milife-magenta;
        position: relative;
        border-left: 2px solid white;
        border-bottom: 2px solid white;
        top: -12px;
        left: -10px;
    }
}
</style>
