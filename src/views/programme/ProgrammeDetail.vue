<template>
<div class="programme-detail-container" v-if="status=='success'">
  <SelectedUserDisplay class="middle-column" :fobj_user="fobj_user"> </SelectedUserDisplay>

  <div class="programme_name info_block">
    <label> PROGRAMME </label>
    <div>{{programme.name}}</div>
  </div>

  <div class="edit-link" v-on:click="goto_edit_programme(programme.id)"> EDIT > </div>

  <div class="start_date info_block">
    <label> START DATE </label>
    <div>{{programme.start_date}}</div>
  </div>

  <div class="end_date info_block">
    <label> END DATE </label>
    <div>{{programme.end_date}}</div>
  </div>

  <div class="coach info_block">
    <label> COACH </label>
    <div> {{coach}}</div>
  </div>

  <section class="sessions">
    <header class="session-heading"><p>REGULAR SESSIONS</p></header>
    <div class="sessions-container">
      <div class="sessions">
        <div v-for="(s,index in sessions" class="session">
          <span> <strong>{{s.day}}</strong> </span><br>
          <span>{{s.time}} </span>
        </div>
      </div>
    </div>
    <div class="link" v-on:click="goto_edit_session(programme.id)"><p>Edit Session > </p></div>
  </section>

  <section class="holidays"> </section>
  <section class="banked-sessions"> </section>
</div>
<div v-else>
  {{status}}
</div>
</template>

<script>
import SelectedUserDisplay from '@/components/SelectedUserDisplay';
export default {
    name: 'ProgrammeDetail',
    props: ['fobj_user',],
    
    components: {SelectedUserDisplay, },
    computed: {
        sessions: function() {
            var d = [];
            var days = [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ];
            
            for(var i in days){
                var day = days[i];
                
                if (this.programme.hasOwnProperty('sessions') && this.programme.sessions.hasOwnProperty(day)){
                    var time = JSON.parse(this.programme.sessions[day].replace(/'/g, '"'));
                    var hh = time['HH'];
                    var mm = time['mm'];
                    var record = {day: day.substring(0,3).toUpperCase(), time: hh+':'+mm};
                    if (hh != '' && mm != ''){
                        d.push(record);
                    }
                }
            }
            return d;
            
        }
    },
    
    data() {
        return {
            user_pk: this.$route.params.pk,
            programme: {},
            coach: "",
            status: 'loading',
        }
    },
    methods: {
        goto_edit_session: function(programme_pk){
            this.$router.push({name: "programme-edit-sessions", params: {"programme_pk": programme_pk}});
        },
        goto_edit_programme: function(programme_pk){
            this.$router.push({name: "programme-edit", params: {"programme_pk": this.$route.params.programme_pk}});
        },

        fetch_programme: function(user_pk, programme_pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_pk + "/programmes/" + programme_pk;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.programme = resp.data;
                    this.fetch_coach(this.programme.coach);
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        fetch_coach: function(coach_id){
            const url = process.env.VUE_APP_BASE_URL+'/api/coaches/' + coach_id;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.coach = resp.data.first_name + ' ' + resp.data.last_name;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },


    },
    mounted() {
        this.fetch_programme(this.$route.params.pk, this.$route.params.programme_pk);

        this.$store.dispatch("theme/set_theme_white");
    },

}
</script>

<style lang="scss">
.programme-detail-container{
    background-color: white;
    display: grid;
    grid-template-columns: 1fr repeat(10, 1fr) 1fr;
    
    .middle-column{
        grid-column: 2/11;
        grid-row: 1;
        **input{
            width: 100%
        }
    }

    .edit-link {
        grid-column: 11;
        grid-row: 2;
        align-self: center;
    }

    .programme_name{
        width: 100%;
        grid-column: 1 / 8;
        grid-row: 2;
    }
    .start_date{
        float: left;
        grid-column: 1 / 6;
        grid-row: 3;
    }
    .end_date {
        float: right;
        grid-column: 6/ 12;
        grid-row: 3;
    }
    .coach {
        grid-column: 1 / 12;
        grid-row: 4;
        background-color: lighten(grey, 30%);;
        padding-left: 10px;
        padding-bottom: 10px;
        border-radius: 20px;
        margin: 10px;
    }
    .info_block{
        float: left;
        padding-top: 10px;
        padding-left: 10px;
        margin: 10px;

        text-align: left;
        label {
            color: $milife-magenta;
            font-size: 16pt;
        }
        div {
            color: black;
            font-size: 18pt;
        }
    }

    section.sessions{
        padding-top: 10px;

        grid-row: 6;
        grid-column: 1/13;
        background-color: $milife-blue;

        .session-heading {
            grid-row: 5;
            grid-column: 1/ 7;
            padding-bottom: 20px;
            p {
                text-align: left;
                padding-left: 10px;
                padding-top: 0;
                margin: 0;
                font-weight: 400;
                color: white;
                font-size: 16pt;
            }
        }

        .link{
            padding-top: 20px;
            p {
                text-align: left;
                padding-left: 0px;
                padding-top: 0;
                margin: 10px;
                font-weight: 400;
                color: white;
                font-size: 14pt;

            }

        }
        .sessions-container{
            overflow-x: scroll;
            margin-bottom: -17px;

        }
        div.sessions{
            height: 100px;
            display: flex;
            flex-direction: row;

            .session{
                font-size: 25pt;
                color: white;
                margin-left: 5px;
                padding:0;
                span {
                    margin-left :10px;
                    margin-top:0px;
                    padding:0;
                }
            }
        }
    }
    .button{
        grid-row: 11;
        grid-column: 1/12;
    }
  }
</style>
