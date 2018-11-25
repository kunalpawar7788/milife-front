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
    
}
</script>
