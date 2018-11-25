<template>
</template>

<script>
export default {
    name: "Logout",
    data() {
        return {
        }
    },
    
    components: {},
    created: function(){
        this.$store.dispatch('auth/logout')
            .then(() => this.$router.push('/login'))
            .catch(err => console.log(err))
        //this.$router.push('/')
    }
}
</script>

<style>

</style>
