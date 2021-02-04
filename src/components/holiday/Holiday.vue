<template>
<div>
  <div class="end-date" v-if="is_admin">
    <span class="label width-100"> PROGRAMME END DATE </span>:
    <span class="date width-100 fc-black fw-500"> {{programme.end_date}}</span>
  </div>

  <FoldableContainer v-if="is_admin" label="Add Holiday">
    <AddHoliday></AddHoliday>
  </FoldableContainer>

  <FoldableContainer label="List Holidays">
    <ListHolidays></ListHolidays>
  </FoldableContainer>
</div>
</template>

<script lang='js'>
import AddHoliday from '@/components/holiday/AddHoliday.vue';
import ListHolidays from '@/components/holiday/ListHolidays.vue';
import FoldableContainer from '@/components/FoldableContainer';

export default {
    name: 'Holiday',
    props: {},
    components: {AddHoliday, ListHolidays, FoldableContainer},
    computed:{
        user_pk: function() {
            return this.$route.params.pk;
        },
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },
        session_days: function() {
            var l = [];
            var time= {};
            for (var day in this.sessions){
                if (this.sessions.hasOwnProperty(day)) {
                    time = this.sessions[day];
                    if (time.HH!='' && time.mm!=''){
                        l.push(day);
                    }
                }
            }
            return l;
        },
    },
    data() {
        return {
            status: '',
            error_message: '',
            errors: '',
            sessions: {
                Monday: {HH:'', mm:''},
                Tuesday: {HH:'', mm:''},
                Wednesday: {HH:'', mm:''},
                Thursday: {HH:'', mm:''},
                Friday: {HH:'', mm:''},
                Saturday: {HH:'', mm:''},
                Sunday: {HH:'', mm:''},
            },
            selected: 'add-holiday',
            programme: {},
            params: {}
        };
    },
    methods: {
        fetch_programme: function(user_pk, programme_pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_pk + "/programmes/" + programme_pk;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.programme = resp.data;
                    for(var day in this.sessions) {
                        var value = resp.data['sessions'][day]
                        if (value) {
                            var time = JSON.parse(value.replace(/'/g, '"'));
                            this.sessions[day] = time;
                        }
                        else {
                            this.sessions[day] = {HH: '', mm: ''};
                        }
                    }
                })
                .catch(err => {
                    this.status="error";
                });
        },
    },
    mounted() {
        this.fetch_programme(this.$route.params.pk, this.$route.params.programme_pk);
        this.$store.dispatch("theme/set_theme_white");
    },
}
</script>

<style lang="scss" scoped>
.end-date {
    color: black;
    margin-top: 15px;
    margin-bottom: 10px;
}
</style>
