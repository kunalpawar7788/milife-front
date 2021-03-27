<template>
<div class="add-holiday-contanier">
  <div class="start_date">
    <datepicker
      v-model="start_date"
      format="dd/MM/yyyy"
      placeholder="Start Date"
      ></datepicker>
  </div>
  <div class="end_date mt-10">
    <datepicker
      v-model="end_date"
      placeholder="End Date"
      format="dd/MM/yyyy"
      ></datepicker>
  </div>
  <div class="days_missed mt-10">
    <input name="days_missed" v-model="days_missed" type="text" value=""
        placeholder="No of Days Missed"
        class="hbs-input hbs-disabled-input" readonly
    />
  </div>
  
  <div class="description mt-10">
    <input name="description" type="text" value="" placeholder="Comment"
           class="hbs-input"
           v-model="description"/>
  </div>
  <div class="programme__date mt-10">
    <datepicker
      v-model="programme_end_date"
      placeholder="New Programme End Date"
      format="dd/MM/yyyy"
      ></datepicker>
  </div>
  <button class="button mt-10" v-on:click="add_holiday"> Add Holiday </button>
</div>
</template>

<script lang="js">
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import formatDate from "@/mixins/formatDate.js";

export default {
    name: "AddHoliday",
    props: [
        'session_days',
    ],
    mixins: [formatDate],
    data() {
        return {
            start_date: '',
            end_date: '',
            description: '',
            programme_end_date: ''
        }
    },
    components: {Datepicker, },
    computed: {
        days_missed: function() {
            var count = 0;
            var start = moment(this.start_date);
            var end = moment(this.end_date);
            if(start._isValid && end._isValid) {
                count = moment.duration(end.diff(start)).asDays()+1;
            }
            count = count + " days missed"
            return count;
        },
        user_pk: function(){
            return this.$route.params.pk;
        },
        programme_pk: function() {
            return this.$route.params.programme_pk;
        },
        submit_url: function(){
            //const base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk;
            return `${process.env.VUE_APP_BASE_URL}/api/programmes/${this.programme_pk}/holiday`
        },
        data: function() {
            return {
                start: this.backEndDateFormat(this.start_date),
                end: this.backEndDateFormat(this.end_date),
                comment: this.description,
                programme_end_date: this.backEndDateFormat(this.programme_end_date),
            }
        },
    },
    methods: {
        reset: function() {
            this.date = '';
        },
        add_holiday: function(){
            return new Promise((resolve, reject) => {
                this.$http({url: this.submit_url, method: "POST", data: this.data})
                    .then(resp => {
                        resolve(resp);
                        this.reset();
                    })
                    .catch(err => {
                        this.status='error';
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
.vdp-datepicker input {
    @extend .text-input;
    border: none;
    font-family: "Montserrat";
    background: url(../../assets/images/chevron-down-solid.svg) 92% no-repeat, linear-gradient($milife-green) right no-repeat;
    background-size: 6%, 20% 100%;
    background-color: white;
    cursor: pointer;
}
input.hbs-disabled-input{
    background:#e8e8e8;
    text-align: center;
    padding: 0 !important;
    font-family: "Montserrat";
}
</style>
