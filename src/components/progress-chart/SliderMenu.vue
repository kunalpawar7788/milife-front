<template>
<div id="slider-container" class="slider-container">
  <div class="months">
    <div
      :id="element.id"
      v-for="element in month_year_list"
      :class="['month', selected==element.id ? 'selected': '' ]"
      v-on:click="select(element)"
      >
      <p>{{element.month}}<br />
      {{element.year}}</p>      
    </div>
  </div>
</div>
</template>

<script>

export default {
    name: "SliderMenu",
    props: ['start_date', 'end_date'],
    data() {
        return {
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", 'Sep', "Oct", "Nov", "Dec"],
            selected: null,
        }
    },
    methods: {
        select: function(element){
            console.log(element);
            this.selected=element.id;
            this.$emit(
                "input",
                {
                    
                    month: element.m,
                    year: element.year,
                })
        },
        get_monthyear_list: function(start_date, end_date) {
            var l = [];
            const start_year = start_date.getFullYear();
            const end_year = end_date.getFullYear();
            var i = 0;
            for(i=start_date.getFullYear(); i<=end_date.getFullYear(); i++) {
                var m = 1;
                var m_end = 12;
                if (i == start_date.getFullYear()) {
                    m = start_date.getMonth();
                }
                if (i == end_date.getFullYear()) {
                    m_end = end_date.getMonth();
                }
                
                for(; m <= m_end; m++) {
                    
                    l.push({
                        month: this.months[m-1],
                        m: m,
                        year:i,
                        id:this.months[m-1] + String(i),
                    });
                    
                }
                
            }
            return l;
        },
    },
    computed: {
        month_year_list: function(){
            return this.get_monthyear_list(this.start_date, this.end_date);
        },
    },
    created: function(){
        
        this.get_monthyear_list(this.start_date, this.end_date);
        var last_element = this.month_year_list.slice(-1)[0]
        this.select(last_element);
    },
    mounted: function() {
        var container = document.getElementById("slider-container");
        console.log(container);
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


