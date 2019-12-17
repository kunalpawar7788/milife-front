<template>
<button class="milife-button" @click="invoke">
  <span><slot> save{{busy}}</slot></span>
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
        clickprevent:{
            type: Function,
            required: false,

        },
    },
    data() {
        return {
            busy: false,
        };
    },

    methods: {
        invoke: function(){
            this.busy=true;
            return new Promise((resolve, reject) => {
                this.onClick()
                    .then({
                        this.busy=false;
                    })
                    .catch({
                        this.busy=false;
                    })

            });
        },
    },
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
    margin-bottom: 20px;
    background-color: #8AC53F;
    
    font-size: 13pt;
    
    outline: 0;
    &__next {
        background-image: url($milife-next-arrow);
        background-repeat: no-repeat;
        background-position: 95% 50%;
        text-align: left;
        padding-left: 20px;
    }
    
    &__prev {
        background-image: url($milife-previous-arrow);
        background-repeat: no-repeat;
        background-position: 5% 50%;
        text-align: right;
        padding-right: 20px;
    }

}

</style>


