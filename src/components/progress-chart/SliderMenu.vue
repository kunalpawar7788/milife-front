<template>
<div id="slider-container" class="slider-container">
  <div id="slider" class="months">
    <div
      :id="element.id"
      v-for="element in checkin_dates"
      :class="['month', selected_value==element.id ? 'selected': '' ]"
      v-on:click="selected_value=element.id"
      >
      <p><template v-if="element.frequency>1">{{element.mobj.format("DD")}}&nbsp</template>{{element.mobj.format("MMM")}}<br/>
      {{element.mobj.format("YY")}}</p>
    </div>
  </div>
</div>
</template>

<script>

export default {
    name: "SliderMenu",
    props: ['value', 'checkin_dates'],
    data() {
        return {

        }
    },
    methods: {
    },
    computed: {
        selected_value: {
            get(){
                var value =  this.value;
                if (value == null && this.checkin_dates.length>0){
                    value = this.checkin_dates.slice(-1)[0].id;
                    this.$emit("input", value);
                }
                return value;
            },
            set(value){
                this.$emit("input", value);
            }

        },
        month_year_list: function(){
            var l = [];
            this.$_.forEach(this.checkin_dates, function(item){
                l.push({
                    date: item.format("DD"),
                    month: item.format("MMM"),
                    year: item.format("YYYY"),
                    id: item.format("YYYY-MM-DD"),
                })
            })
            return l;
        },
    },
    created: function(){

    },
    mounted: function() {
        var container = document.getElementById("slider-container");
        container.scrollLeft += container.scrollWidth;
    },

}
</script>

<style lang="scss">
.slider-container {
    overflow-x: scroll;
    margin-bottom: -17px;
    .months{

        display: flex;
        flex-direction: row;

        .selected {
            background-color: $milife-green;
        }

        .month{
            &:hover{
                background-color: lighten($milife-green, 10%);
            }
            &:active{
                background-color: darken($milife-green, 10%);
            }

            border-radius: 10px;
            padding-bottom: 17px;
            margin-left: 5px;

            p {
                margin-top: 1px;
                font-size: 17pt;
                height: 20px;
                width: 80px;
            }
        }
    }
}

</style>
