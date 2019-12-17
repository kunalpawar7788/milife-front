<template>
<div class="avail-banked-session mt-20">
  <datepicker
    v-model="date"
    placeholder="Date Banked Session Used"
    format="dd/MM/yyyy"
    >
  </datepicker>
  <button class="button mt-10" v-on:click="avail_banked_session"> Avail Banked Session </button>

  </div>
</template>

<script lang="js">
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';

export default {
    name: "AvailBankedSession",
    data(){
        return {
            status: '',
            date: '',
        };
    },
    components: {
        Datepicker,
    },
    props: [
        'reload_balance',
    ],
    computed: {
        user_pk: function(){
            return this.$route.params.pk;
        },
        programme_pk: function() {
            return this.$route.params.programme_pk;
        },
        submit_url: function(){
            const base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk;
            return `${process.env.VUE_APP_BASE_URL}/api/programmes/${this.programme_pk}/leave-ledger`;
        },
        data: function() {
            return {
                date: moment(this.date).format('YYYY-MM-DD'),
                kind: 'D',
            }
            
        },
        
    },
    methods: {
        reset: function(){
            this.date = '';
        },
        avail_banked_session: function(){
            return new Promise((resolve, reject) => {
                const url = this.submit_url;
                var data = this.data;
                
                this.$http({url: this.submit_url, method: "POST", data: this.data})
                    .then(resp => {
                        resolve(resp);
                        this.reset();
                        this.reload_balance();
                    })
                    .catch(err => {
                        this.status='error';
                        console.log(err);
                        reject(err);
                    });
            });
        },
    },
    
    mounted(){
        this.$store.dispatch("theme/set_theme_white");
    },
}

</script>

<style lang="scss">
.avail-banked-session{
    
}
</style>


