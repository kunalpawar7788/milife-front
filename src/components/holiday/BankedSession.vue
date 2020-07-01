<template>
<div class="banked-session-container">
  <h3>  Banked session balance: {{balance}}</h3>
  <FoldableContainer v-if="is_admin" label="Add Banked Session">
    <AddBankedSession :reload_balance="fetch_balance"></AddBankedSession>
  </FoldableContainer>
  <FoldableContainer v-if="is_admin" label="Use Banked Session">
    <AvailBankedSession :reload_balance="fetch_balance"></AvailBankedSession>
  </FoldableContainer>
</div>
</template>

<script lang="js">
import AddBankedSession from '@/components/holiday/AddBankedSession.vue';
import AvailBankedSession from '@/components/holiday/AvailBankedSession';
import FoldableContainer from '@/components/FoldableContainer';

export default {
    name: "BankedSession",
    data(){
        return {
            status: '',
            balance: 0,
        };
    },
    components: {
        AddBankedSession,
        AvailBankedSession,
        FoldableContainer,
    },
    computed: {
        user_pk: function(){
            return this.$route.params.pk;
        },
        programme_pk: function() {
            return this.$route.params.programme_pk;
        },
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },
        url: function(){
            const base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk;
            return `${process.env.VUE_APP_BASE_URL}/api/programmes/${this.programme_pk}/leave-ledger`;
        },
    },
    methods: {
        fetch_balance: function(){
            return new Promise((resolve, reject) => {
                this.$http({url: this.url, method: "GET"})
                    .then(resp => {
                        resolve(resp);
                        this.balance = resp.data['balance'];
                    })
                    .catch(err => {
                        this.status='error';
                        reject(err);
                    });
            });
        },
    },
    mounted(){
        this.fetch_balance();
        this.$store.dispatch("theme/set_theme_white");
    },
}
</script>

<style lang="scss">
.banked-session-container {
    
}
</style>
