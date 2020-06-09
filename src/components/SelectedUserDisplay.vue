<template>
<div class="disabled-input-text">
  <input
    type="text"
    class="text-input"
    :value="full_name"
    disabled=true
    >
    </input>
</div>
</template>

<script>
export default{
    name: "SelectedUserDisplay",
    props: ['fobj_user',],
    computed: {
        user() {return this.fobj_user;},
        full_name() {
            return this.user.first_name + " " + this.user.last_name;
        },
    },
}
</script>

<style lang="scss">
.disabled-input-text {

    input{
        border: 1px solid #e6e6e6;
        background-color: lighten(grey, 40%);
        text-align: center;
        padding: 0;
        height: 45px;
        text-transform: uppercase;
        font-family: Montserrat;
        margin-bottom: 10px;
        font-weight: 500;
    }
}

@media screen and (max-width: 358px) {
    .disabled-input-text {
        input{
            width:80%;
        }
    }
}

</style>
