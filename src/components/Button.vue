<template>
<button class="milife-button" @click.prevent="onClick">
  <span><slot>Button</slot></span>
</button>
</template>

<script>
export default {
    name: 'MilifeButton',

    props: {
        onClick: {
            type: Function,
            required: false
        },
    }
}

</script>

<style lang="scss">
.milife-button {
    border: none;
    border-radius: 50px;
    height: 55px;
    color: white;
    margin-top: 70px;
    margin-bottom: 20px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #8AC53F;    
    font-size: 13pt;    
    outline: 0;

    &__next {
        background-image: url($milife-next-arrow);
        background-repeat: no-repeat;
        background-position: 90% 50%;
        text-align: left;
        padding-left: 20px;
    }
    
    &__prev {
        background-image: url($milife-previous-arrow);
        background-repeat: no-repeat;
        background-position: 10% 50%;
        text-align: right;
        padding-right: 20px;
    }
    &__fullsize {
        width: 270px;
    }
    &__halfsize {
        width: 140px;
    }

}

</style>


