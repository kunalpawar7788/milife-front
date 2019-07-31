<template>
  <div id="my-profile-edit-container">

    <h1> Edit Profile </h1>
  </div>
</template>

<script>
export default {
    name: "MyProfile",
    components: [],
    props: {},
    data() {
        return {
        };
    },
    computed: {

    },
    methods: {

    },
    created() {
        this.$store.dispatch("theme/set_theme_blue");
    },
    mounted(){

    },
}
</script>

<style lang="scss">
#my-profile-edit-container {

}
</style>
