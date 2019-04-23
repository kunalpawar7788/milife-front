<template>
<div class="programme-edit-sessions-container">
  <SelectedUserDisplay class="middle-column" :fobj_user="fobj_user"> </SelectedUserDisplay>
  <h4> Session Timings </h4>
  <div class="sessions" v-for="(time, day) in sessions" :key="day">
    <div class="day"> {{day}}</div>
    <timepicker
      class="time"
      format="HH:mm"
      :minute-interval="15"
      :value="sessions[day]"
      @change="set_time($event, day)"
      >
    </timepicker>

  </div>
  <div class="button" v-on:click="upsert_programme()">save </div>
</div>

</template>

<script>
import moment from "moment";
import Timepicker from 'vue2-timepicker'
import Multiselect from 'vue-multiselect';
import SelectedUserDisplay from '@/components/SelectedUserDisplay';

export default{
    name: 'ProgrammeEditSessions',
    components: {Timepicker, Multiselect, SelectedUserDisplay},
    props: ['fobj_user', ],
    data() {
        return {
            day_of_week_options: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            sessions: {
                Monday: {HH:'', mm:''},
                Tuesday: {HH:'', mm:''},
                Wednesday: {HH:'', mm:''},
                Thursday: {HH:'', mm:''},
                Friday: {HH:'', mm:''},
                Saturday: {HH:'', mm:''},
                Sunday: {HH:'', mm:''},
            },
        }
    },
    computed: {
        user() {return this.fobj_user;},
        full_name() {
            return this.fobj_user.first_name + " " + this.fobj_user.last_name;
        },
        programme_pk() {
            // if document_id exists, edit the document or add it.
            return this.$route.params.programme_pk || '';
        },
        user_pk() {
            return this.$route.params.pk;
        },
        upsert_method() {
            return this.programme_pk? 'PATCH' : 'POST';
        },
        upsert_url() {
            var base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/programmes";
            return this.programme_pk?  base_url + "/" + this.programme_pk: base_url;
        },

    },
    methods: {
        fetch_programme: function(user_pk, programme_pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_pk + "/programmes/" + programme_pk;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};

                    for(var day in this.sessions) {
                        var value = resp.data['sessions'][day]
                        if (value) {
                            var time = JSON.parse(value.replace(/'/g, '"'));
                            this.sessions[day] = time;
                        }
                        else {
                            this.sessions[day] = {HH: '', mm: ''};
                        }
                        console.log(this.sessions);
                    }
                })
                .catch(err => {
                    this.status="error";
                    console.log(err);
                });

        },
        set_time: function(event, day){
            var value = {'HH': event.data['HH'], 'mm': event.data['mm']};
            console.log(event, value, day);
            this.sessions[day] = value;
        },

        upsert_programme: function(){
            return new Promise((resolve, reject) => {
                var data = {
                    user: this.user_pk,
                    sessions: this.sessions,
                };

                this.$http({url: this.upsert_url, method: this.upsert_method, data: data})
                    .then(resp => {
                        resolve(resp);
                        this.$router.go('-1');

                    })
                    .catch(err => {
                        this.status='error';
                        console.log(err);
                        reject(err);
                    });
            });
        },
    },
    mounted() {
        this.$store.dispatch("theme/set_theme_white");
        if (this.programme_pk) {
            this.status='loading';
            this.fetch_programme(this.$route.params.pk, this.$route.params.programme_pk);
        }
        else{
            this.status = 'success';
        }
    },
}
</script>

<style lang="scss">
div.programme-edit-sessions-container {
    div.sessions {
        display: grid;
        grid-template-columns: 1fr 2fr 2fr 1fr;
        grid-row-gap: 10px;
        justify-items: center;
        margin-top: 10px;

        div.day {
            grid-column: 2;
            align-self: center;
        }
        div.time{
            grid-column: 3;
        }
    }
}
</style>
