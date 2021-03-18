<template>
<div class="holiday-banked-session-container">
  <div class="header pd-10">
    <span
      :class="[selected=='holiday'? 'selected': '']"
      v-on:click="selected='holiday'">Holidays</span>
    <span
      :class="[selected=='banked_session'? 'selected': '']"
      v-on:click="selected='banked_session'">Banked Sessions</span>
  </div>
  <Holiday v-if="selected=='holiday'"></Holiday>
  <BankedSession v-if="selected=='banked_session'"></BankedSession>
</div>
</template>

<script lang="js">
import Holiday from '@/components/holiday/Holiday.vue';
import BankedSession from '@/components/holiday/BankedSession.vue';

export default {
    name: 'HBSView',

    props: {},
    components: {Holiday, BankedSession},

    data() {
        return {
            selected: 'holiday',
            programme_end_date: "08/09/2019",
        };
    },
    methods: {

    },
    mounted () {
        this.$store.dispatch("theme/set_theme_white");
        //this.$store.dispatch("checkin/fetch_checkin_for_user_by_date", this.user_id, this.checkin_date);
        //this.$store.dispatch("checkin/fetch_checkin_for_user_by_date", this.user_id, new Date());
    },
}

</script>

<style lang="scss">
.holiday-banked-session-container {
    color: black;
    padding-bottom: 20px;

    input {
        color: black;
        border: none;
        border-radius: 50px;
        height: 50px;
        font-size: 18px;
        max-width: 400px;
        width: 100%;
        outline: none;

        &::placeholder {
            color: #232323;
        }
    }

    .hbs-input {
        padding-left: 20px;
        max-width: 380px;
    }

    div.header {
        font-size: calc(16pt + 0.5vmin);
        display: block;
        height:20px;

        color: $pastel-blue;
        span:first-child{
            float:left;
        }
        span:last-child{
            float:right;
        }
        .selected {
            color: $milife-blue;

        }
    }
    .vdp-datepicker {
        text-align: center;
        padding-top: 5px;

        color: $milife-green;

        .vdp-datepicker__calendar {
            max-width: 300px;
            width: 100%;
            left: 0; 
            right: 0; 
            margin-left: auto; 
            margin-right: auto; 
        }
    }
}
@media screen and (max-width: 415px) {
    .holiday-banked-session-container {
        input {
            font-size: 16px;
        }
        .hbs-input {
            max-width: calc(100vw - 80px);
        }
        .vdp-datepicker .vdp-datepicker__calendar {
            font-size: 13px;
        }
    }
}
@media screen and (max-width: 330px) {
    .holiday-banked-session-container {
        input {
            font-size: 13px;
        }
    }
}
</style>
