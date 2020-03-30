<template>
<div class="holiday-banked-session-container">
  <div class="header fn-18 width-100 pd-10">
    <span> Holiday and banked session </span>
  </div>
  <Holiday></Holiday>
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
    mounted: function() {
        this.$store.dispatch("theme/set_theme_white");
        //this.$store.dispatch("checkin/fetch_checkin_for_user_by_date", this.user_id, this.checkin_date);
        //this.$store.dispatch("checkin/fetch_checkin_for_user_by_date", this.user_id, new Date());

    },

}

</script>

<style lang="scss">
.holiday-banked-session-container {
    color: black;

    div.header {
        display: block;
        height:20px;

        color: $pastel-blue;
        span:first-child{
            float:center;
        }

    }
    .vdp-datepicker {
        text-align: center;
        padding-top: 5px;

        color: #8AC53F;

        input {
            color: red;
            border: 1px solid grey;
            border-radius: 50px;
            color: grey;
            height: 50px;
            padding-left: 20px;
            font-size: 15pt;
            font-family: Monteserrat Regular;
            width: 300px;
            outline: none;

        }
    }
    h3{
        float: left;
        margin-left: 15px;
    }
}
</style>
