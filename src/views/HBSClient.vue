<template>
<div class="holiday-banked-session-container">
  <div class="header">
    <span class="hbs-client-header-text"> Holidays and banked sessions </span>
  </div>
  <div class="holiday_container">
      <Holiday></Holiday>
  </div>
  <BankedSession></BankedSession>
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
        font-size: 14pt;
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
        display: block;
        font-size: calc(16pt + 0.5vmin);
        color: $pastel-blue;
        margin-bottom: 10px;

        span.hbs-client-header-text{
            text-align: center;
            width: 100%;
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
    .holiday_container{
        padding: 10px;
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
