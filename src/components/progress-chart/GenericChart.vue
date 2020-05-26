<template>
<div class="generic-chart" v-if="datapoints">
  <svg id="generic-chart" :width="canvas_width" :height="canvas_width">
  </svg>
  <table>
    <template v-for="o in datapoints" v-if="false">
      <tr> <td>{{o.date.format("DD-MM-YY")}}</td> <td> {{o.value}}</td></tr>
    </template>
    </table>

</div>
</template>

<script>
import * as d3 from 'd3';
export default {
    name: 'GenericChart',
    data() {
        return {
            canvas_width: 300,
            canvas_height: 300,
            margin: {top: 10, right: 10, bottom: 30, left: 30},
            margin_top: 10,
            margin_left: 30,
            margin_bottom: 30,
            margin_right: 10,
        };

    },
    components: {},
    props: ['datapoints', 'field'],
    computed: {
        points: function(){},
        all_dates: function(){
            var l = [];
            this.$_.forEach(this.filteredDatapoints, o => l.push(o.date));
            return l;
        },
        all_values: function(){
            var l = [];
            this.$_.forEach(this.filteredDatapoints, o => l.push(o.value));
            return l;
        },

        width: function(){return this.canvas_width - this.margin_left - this.margin_right;},
        height: function(){return this.canvas_height - this.margin_top - this.margin_bottom;},

        delta_y: function(){
            return (this.$_.max(this.all_values) - this.$_.min(this.all_values))/10;
        },

        min_x: function(){return this.$_.min(this.all_dates)},
        max_x: function(){return this.$_.max(this.all_dates)},
        min_y: function(){return this.$_.max(([this.$_.min(this.all_values) - this.delta_y, 0]))},
        // min_y: function(){return this.$_.min(this.all_values)},
        max_y: function(){return Number(this.$_.max(this.all_values)) + this.delta_y},

        coords: function(){
            return this.datapoints.map(node => {
                return {
                    x: d3.scaleLinear().domain([this.min_x, this.max_x]).range([0,this.width])(node.bmi),
                    y: d3.scaleLinear().domain([this.min_y, this.max_y]).range([this.height,0])(node.bfp)
                }
            })
        },
        translator: function(){return "translate(" + this.margin_left + "," + this.margin_top + ")"},

        x_axis: function(){
            return d3.axisBottom()
                .scale(d3.scaleTime().domain([this.min_x, this.max_x]).range([0, this.width]))
                .ticks(d3.timeMonth.every(3))
                .tickFormat(d3.timeFormat("%b %y"));
        },

        y_axis: function(){return d3.axisLeft().scale(
            d3.scaleLinear().domain([this.min_y, this.max_y]).range([this.height, 0])
        )},

        x_axis_gridline:
        function(){
            return d3.axisBottom()
                .scale(d3.scaleTime().domain([this.min_x, this.max_x]).range([0, this.width]))
                .ticks(20)
                .tickFormat("")
                .tickSize(-this.height+this.margin.top, 0, 0)
        },
        y_axis_gridline: function(){
            return d3.axisLeft()
                .scale(
                    d3.scaleLinear().domain([this.min_y, this.max_y]).range([this.height, 0]))
                .ticks(20)
                .tickFormat("")
                .tickSize(-this.width,0, 0)
        },

    },
    methods: {
        x: function(value){
            return d3.scaleTime().domain([this.min_x, this.max_x]).range([0, this.width])(value)
        },
        y: function(value){
            return d3.scaleLinear().domain([this.min_y, this.max_y]).range([this.height, 0])(value)
        },
        load_plot: function(){
            var svgContainer = d3.select("svg#generic-chart");
            console.log(this.datapoints)
            var line = d3.line()
                .x(function(d) {
                    console.log('x', d.date, this.x(d.date));
                    return this.x(d.date)}
                   .bind(this))
                .y(function(d) {
                    console.log('y', d.value, this.y(d.value));
                    return this.y(d.value)}.bind(this));

            svgContainer.append("g")
                .attr("class", "gridlines")
                .attr("transform", function(){
                    const temp = this.height +this.margin.top
                    return "translate(" + this.margin.left + "," + temp + ")";
                }.bind(this))
                .call(this.x_axis_gridline.tickSizeOuter(0));

            svgContainer.append("g")
                .attr("class", "gridlines")
                .attr("transform", function(){
                    return "translate(" + this.margin.left + "," + this.margin.top + ")";
                }.bind(this))
                .call(this.y_axis_gridline.tickSizeOuter(0))

            svgContainer.append("g")
                .classed("x-axis", true)
                .attr("transform", function() {
                    // console.log(height- margin.bottom)
                    const temp = this.height +this.margin.top
                    return "translate(" + this.margin.left + "," + temp + ")";
                }.bind(this))
                .call(this.x_axis);

            svgContainer.append("g")
                .classed("y-axis", true)
                .attr("transform", function() {
                    return "translate(" + this.margin.left + "," + this.margin.top + ")";
                }.bind(this))
                .call(this.y_axis);

            svgContainer.append("path")
                .classed("line-chart", true)
                .attr("d", line(this.filteredDatapoints))
                .attr("transform", function() {
                    return "translate(" + this.margin.left + "," + this.margin.top + ")";
                }.bind(this));


        },
        filterDatapoints: function() {
            this.filteredDatapoints = this.datapoints.filter((data) => {
                return data.value > 0;
            })
        },

    },
    created(){ this.filterDatapoints() },
    mounted(){ this.load_plot()},
}
</script>

<style lang="scss">
svg#generic-chart {

    background-color: darken($milife-blue, 1%);

    path {
        fill: none;
        /* stroke: #76BF8A; */
        stroke: $milife-green;
        stroke-width: 2px;
    }

    .x-axis{
        path{
        stroke: blue;
        stroke-width: 2px;
        }
    }
    .y-axis{
        path{
        stroke: blue;
        stroke-width: 2px;
        }
    }
    .gridlines {
        line {
            stroke: grey;
            stroke-width: 1px;
            opacity: 0.33;
        }


    }


}
</style>
