<template>
<div class="programme-detail-container" v-if="status=='success'">
  <SelectedUserDisplay
    v-if="fobj_user"
    class="middle-column"
    :fobj_user="fobj_user"></SelectedUserDisplay>

  <div class="programme_name info_block">
    <label> PROGRAMME </label>
    <div>{{programme.name}}</div>
  </div>

  <div
    v-if="is_admin"
    class="edit-link fc-black"
    v-on:click="goto_edit_programme(programme.id)">
      <img src="@/assets/images/edit-white.svg" />
  </div>

  <div class="start_date info_block">
    <template v-if="is_admin">
      <label> START DATE </label>
      <div>{{programme.start_date | moment('DD/MM/YYYY') }}</div>
    </template>
    <template v-else>
      <label> STARTED </label>
      <div>{{programme.start_date | moment('D MMM YYYY') | uppercase }}</div>
    </template>
  </div>

  <div class="end_date info_block">
    <template v-if="is_admin">
      <label> END DATE </label>
      <div>{{programme.end_date | moment('DD/MM/YYYY')}}</div>
    </template>
    <template v-else>
      <label> ENDS </label>
      <div>{{programme.end_date | moment('D MMM YYYY') | uppercase}}</div>
    </template>
  </div>

  <div class="coach info_block">
    <div class="coach_block">
        <div>
            <template v-if="is_admin">
                <label> COACH </label>
            </template>
            <template v-else>
                <label> YOUR COACH </label>
            </template>
            <div> {{`${coach.first_name} ${coach.last_name}` | uppercase }}</div>
        </div>
        <div class="coach_block-btn">
            <div id="coach_btn">
                <template v-if="is_admin">
                    <span v-on:click="goto_edit_programme(programme.id)">CHANGE</span>
                </template>
                <template v-else>
                    <a :href="`mailto:${coach.email}`">CONTACT</a>
                </template>
                <img src="@/assets/images/next-arrow.svg">
            </div>
        </div>
    </div>
  </div>

    <template v-if="is_admin">
        <div class="admin-sessions">
            <section class="sessions">
                <header class="session-heading">
                    <p>REGULAR SESSIONS</p>
                </header>
                <div class="sessions-container">
                    <div class="sessions">
                        <div v-for="(s,index) in sessions" class="session">
                        <span> <strong>{{s.day}}</strong> </span><br>
                        <span>{{s.time}} </span>
                        </div>
                    </div>
                </div>
                <div class="link" v-on:click="goto_edit_session(programme.id)"> 
                    <p>Edit Session ></p>
                </div>
            </section>
        </div>
    </template>
    <template v-else>
        <section class="sessions client-sessions">
            <header class="session-heading">
                <p>YOUR REGULAR SESSIONS</p>
            </header>
            <div class="sessions-container">
                <div class="sessions">
                    <div v-for="(s,index) in sessions" class="session">
                        <template v-if="s.is_today">
                            <span><strong>{{s.day}}</strong></span><br>
                            <span>{{s.time}} </span>
                        </template>
                        <template v-else>
                            <span class="grey"><strong>{{s.day}}</strong></span><br>
                            <span class="grey">{{s.time}} </span>
                        </template>
                    </div>
                </div>
            </div>
        </section>
    </template>

  <div class="info" v-if="!is_admin">
      <p>Changes agreed with your coach are not reflected here</p>
  </div>

  <section class="hbs">
    <button class="button hbs_button" v-if="is_admin" v-on:click="goto_hbs()"> 
        Holidays and Banked Sessions 
        <span>
            &#10095;
        </span>
    </button>
    <button class="button hbs_button" v-else v-on:click="goto_client_hbs()"> 
        Holidays and Banked Sessions 
        <span>
            &#10095;
        </span> 
    </button>

  </section>

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
            var currentDate = new Date(); 
            var currentDay = currentDate.getDay();
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
            var index = currentDay-1;
            var today = days[index];
            while(index < days.length + currentDay - 1){
                var day = days[index % days.length];

                if (this.programme.hasOwnProperty('sessions') && this.programme.sessions.hasOwnProperty(day)){
                    var time = JSON.parse(this.programme.sessions[day].replace(/'/g, '"'));
                    var hh = time['HH'];
                    var mm = time['mm'];
                    var bool = false;
                    if (day == today){
                        bool = true;
                    }
                    var record = {day: day.substring(0,3).toUpperCase(), time: hh+':'+mm, is_today: bool};
                    if (hh != '' && mm != ''){
                        d.push(record);
                    }
                }
                index = index + 1;
            }
            return d;

        },
        user_pk: function(){
            if (this.$route.params.pk) {
                return this.$route.params.pk;
            }
            else {
                return this.$store.state.auth.user.id;
            }
        },
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },
    },

    data() {
        return {
            programme: {},
            coach: "",
            status: 'loading',
        }
    },
    methods: {
        goto_hbs: function() {
            this.$router.push({name: "admin-hbs", params: {pk: this.fobj_user.id}});
        },
        goto_client_hbs: function() {
            this.$router.push({name: "client-hbs", params: {pk: this.user_pk}});
        },
        goto_edit_session: function(programme_pk){
            this.$router.push({name: "programme-edit-sessions", params: {"programme_pk": programme_pk,  pk: this.fobj_user.id}});
        },
        goto_edit_programme: function(programme_pk){
            this.$router.push({name: "programme-edit", params: {"programme_pk": this.$route.params.programme_pk}});
        },

        fetch_programme: function(programme_pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/programmes/" + programme_pk;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.programme = resp.data;
                    this.fetch_coach(this.programme.coach);
                    this.$store.dispatch("theme/set_theme_white");
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
                    this.coach = resp.data;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },


    },
    filters: {
        uppercase: function(v) {
            return v.toUpperCase();
        }
    },
    created() {
        console.log('programme detail');
        this.fetch_programme(this.$route.params.programme_pk);
    },

}
</script>

<style lang="scss">
.programme-detail-container{
    background-color: white;
    display: grid;
    grid-gap: 10px 0px;
    grid-template-columns: 1fr repeat(10, 1fr) 1fr;

    .middle-column{
        grid-column: 1/13;
        grid-row: 1;
        **input{
            width: 100%
        }
    }

    .edit-link {
        grid-column: 11;
        grid-row: 2;
        align-self: center;
        padding: 8px;
        width: 25px;
        font-size: 1px;
        border-radius: 50%;
        background-color: $milife-magenta;
        cursor: pointer;
    }

    .programme_name{
        width: 100%;
        grid-column: 2 / 12;
        grid-row: 2;
    }
    .start_date{
        float: left;
        grid-column: 2 / 7;
        grid-row: 3;
    }
    .end_date {
        float: right;
        grid-column: 7/ 12;
        grid-row: 3;
    }
    .coach {
        grid-column: 1 / -1;
        grid-row: 4;
        background-color: #ebebeb;
        padding: 10px;
        border-radius: 1.2em;
        margin: 5%;
    }
    .info_block{
        float: left;
        /* padding-left: 10px; */
        /* margin: 10px; */

        text-align: left;
        label {
            color: $milife-magenta;
            font-size: calc(10pt + 0.5vmin);
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        div {
            color: black;
            font-size: calc(13pt + 0.5vmin);
            font-weight: 500;
        }
    }
    .coach.info_block {
        padding: 15px 11px;
    }
    section.sessions{
        padding: 0 5%;
        grid-row: 5;
        grid-column: 1 / -1;
        /* background-color: $milife-blue; */

        .session-heading {
            grid-row: 5;
            grid-column: 1/ 7;
            margin-bottom: 5px;

            p {
                text-align: left;
                padding-left: 10px;
                padding-top: 0;
                margin: 0;
                font-size: calc(12pt + 0.5vmin);
                font-weight: 500;
                color: $milife-magenta;
            }
        }

        .link{
            //padding-top: 20px;
            p {
                text-align: left;
                padding-left: 0px;
                padding-top: 0;
                margin: 15px 10px;
                font-weight: 400;
                color: black;
                font-size: 12pt;

            }

        }
        .sessions-container{
            overflow-x: scroll;
            //margin-bottom: -17px;

        }
        div.sessions{
            padding-top: 0.5em;
            display: flex;
            flex-direction: row;

            .session{
                font-size: calc(18pt + 0.5vmin);
                text-align: left;
                color: black;
                margin-right: 5px;
                padding:0;
                span {
                    margin-left :10px;
                    margin-top:0px;
                    padding:0;
                }
            }
        }
    }

    .admin-sessions {
        background-color: $milife-blue;
        grid-row: 6;
        grid-column: 1 / -1;
        padding: 20px 0 10px 0;

        section.sessions {
            .session-heading p,
            div.sessions .session,
            .link p {
                color: #fff;
            }
        }
    }

    .client-sessions {
        .grey {
            color: #a0a0a0;
        }
    }

    .info {
      grid-row: 6 / 9;
      grid-column: 2 / -2;
      color: darken(lightgray, 20%);
      text-align: left;
      font-weight: 500;
      font-size: calc(11pt + 0.5vmin);
    }

    .button{
        grid-row: 11;
        grid-column: 1/-1;
        color: #fff;
        font-size: calc(15px + 0.5vmin)
    }
    .hbs{
        grid-column: 1/-1;
        grid-row: 9;
        padding: 0px 0px 20px 0px;
    }
    .hbs_button{
        line-height: 0em;
    }

    .coach_block{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .coach_block-btn{
            display: block;
            line-height: 2.5;
            width: 120px;
            border-radius: 2rem;
            text-align: center;
            background-color: $milife-magenta;
    }

    #coach_btn{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: #fff;
        font-size: calc(10pt + 0.5vmin);
        font-weight: 400;

        a {
            font-weight: 400;
        }

        img {
            height: 1em;
        }
    }
    
  }

@media screen and (min-width: 400px) {
    .programme-detail-container{
        .coach {
            .info_block {
                margin: 15px 30px;
            }
        }
    }
  }
</style>
