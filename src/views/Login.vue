<template>
<Authentication />
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
