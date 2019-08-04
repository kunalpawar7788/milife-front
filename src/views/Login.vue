<template>
<div class="flex-center height-100">
  <Authentication />
</div>
</template>

<script>
import store from '@/store';
import Authentication from '@/components/Authentication';

export default {
    name: 'Login',
    data() {
        return {
        }
    },
    components: {
        Authentication
    },
    mounted() {
        this.$store.dispatch("theme/set_theme_blue");
    },

}
</script>

<style lang="scss">
</style>
