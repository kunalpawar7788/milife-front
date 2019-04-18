<template>
<div class="progresschart-container">

  <div class="menu">
    <SliderMenu
      v-bind:start_date="start_date"
      v-bind:end_date="end_date"
      v-on:input="set_month($event)"
      ></SliderMenu>
  </div>
  <br />
  <div class="debug">
    {{selected_month_year}}
  </div>
  <BodyTypeProgressionChart> </BodyTypeProgressionChart>
</div>
</template>

<script>
import SliderMenu from "@/components/progress-chart/SliderMenu.vue";
import BodyTypeProgressionChart from "@/components/progress-chart/BodyTypeProgressionChart.vue";
export default {

    name:"ProgressChart",
    components: {SliderMenu, BodyTypeProgressionChart},
    data() {
        return {
            start_date: new Date(2018,1,10),
            end_date: new Date(2019,1,1),

            selected_month_year: {}

        }
    },
    methods: {
        set_month: function(event) {
            this.selected_month_year = event
        },

    },
    mounted() {
        this.$store.dispatch("theme/set_theme_blue");
    },


}
</script>

<style lang="scss">
.progresschart-container{
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 80% 1fr;

    .menu{
        grid-column: 2;
    }
    .debug {
        padding-top: 100px;
        grid-column: 2;
    }
    div{
        grid-column: 2;
    }
    svg {
        grid-column: 1 3;
    }

}
</style>
