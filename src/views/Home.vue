<template>
<div class="home">
  <div v-if="this.showEmailVerification"> <UserEmailVerificationPending /> </div>
  <div v-else-if="this.isTrainer"> <TrainerDashboard /></div>
<div v-else> <ClientDashboard /> </div>

</div>

</template>

<script>
// @ is an alias to /src
import TrainerDashboard from '@/components/TrainerDashboard.vue'
import ClientDashboard from '@/components/ClientDashboard.vue'
import UserEmailVerificationPending from '@/components/UserEmailVerificationPending.vue'

import store from '@/store'

export default {
    name: 'home',
    data() {
        console.log('flag', store.getters['auth/isUserEmailVerified']);
        return {
            showEmailVerification: !store.getters['auth/isUserEmailVerified'],
            isAuthenticated: store.getters['auth/isAuthenticated'],
            isTrainer: store.getters['auth/is_staff'],
            
        }
    },
    components: {
        TrainerDashboard,
        ClientDashboard,
        UserEmailVerificationPending,        
    },
    created: function(){
        console.log('here:', store.getters['auth/fetch_profile_flag'])
        if (store.getters['auth/fetch_profile_flag']){
            console.log('dispatching fetch profile');
            store.dispatch("auth/fetch_profile");
        }
    }
}
</script>
