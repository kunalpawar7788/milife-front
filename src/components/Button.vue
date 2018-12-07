<template>
<button class="milife-button" @click="onClick">
  <slot>Button</slot>
</button>
</template>

<script>
export default {
    name: 'MilifeButton',

    props: {
        onClick: {
            type: Function,
            required: true
        }
    }
}

</script>

<style lang="scss">
.milife-button {
    border: none;
    border-radius: 50px;
    height: 55px;
    width: 320px;
    color: white;
    margin-top: 70px;
    background-color: #8AC53F;
    margin-bottom: 20px;
    padding-left: 20px;
    font-size: 13pt;
    text-align: left;
    outline: 0;
    background-image: url($milife-next-arrow);
    background-repeat: no-repeat;
    background-position: 95% 50%;
    
}

</style>

