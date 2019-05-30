<template>
<div class="weight-chart">
  <svg id="weightChartSvg"
       :height="height"
       :width="width"

    preserveAspectRatio="xMidYMid meet">
    >
  </svg>
</div>

</template>

<script>
import * as d3 from 'd3';

export default {
    name: 'MiniWeightChart',
    props: ['weight_log', 'height', 'width', 'target_weights'],
    data() {
        return {
        }
    },

    computed: {
        viewbox() {
            return "0 0 "+ this.width + " " + this.height;
        },
        data1() {
            var d = [];
            for(var i=0; i<this.weight_log.length; i++){
                d.push({x: this.weight_log[i].measured_on, y: this.weight_log[i].weight})
            }
            return this.$_.orderBy(d, 'x');
        },

        data2() {
            var d = [];
            for(var i=0; i<this.target_weights.length; i++){
                d.push({x: this.target_weights[i].target_date, y: this.target_weights[i].target_weight})
            }
            return this.$_.orderBy(d, 'x');
        },

        target_data(){

        },
        all_dates() {
            var d= [];
            for(var i=0; i<this.weight_log.length; i++){
                d.push(this.weight_log[i].measured_on);
            }
            for(var i=0; i<this.target_weights.length; i++){
                d.push(this.target_weights[i].target_date);
            }
            return d.sort();
        },
        all_weights() {
            var d = [];
            for(var i=0; i<this.weight_log.length; i++){
                d.push(this.weight_log[i].weight);
            }
            for(var i=0; i<this.target_weights.length; i++){
                d.push(this.target_weights[i].target_weight);
            }
            return d;
        }
    },
    methods:{

        load_chart3: function() {

            var margin = {top: 1, right: 1, bottom: 1, left: 1},
                width = this.width - margin.left - margin.right,
                height = this.height - margin.top - margin.bottom;

            var x = d3.scaleTime()
                .range([0, width])
                .domain([new Date(this.all_dates[0]), new Date(this.all_dates.slice(-1)[0])]);

            var y = d3.scaleLinear()
                .domain([this.$_.min(this.all_weights), this.$_.max(this.all_weights)])
                .range([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)

            var xMinorAxis = d3.axisBottom()
                .scale(x)
	              .ticks(d3.timeHours,24)

            var yAxis = d3.axisLeft()
                .scale(y)


            var svgContainer = d3.select("svg");
            // .attr("width", this.width)
            // .attr("height", this.height);
            //.style("border", "1px solid");

            // svgContainer.append("g")
            //     .classed("x-axis", true)
            //     .attr("transform", function() {
            //         // console.log(height- margin.bottom)
            //         const temp = height +margin.top
            //         return "translate(" + margin.left + "," + temp + ")";
            //     })
            //     .call(xAxis);


            // svgContainer.append("g")
            //     .classed("y-axis", true)
            //     .attr("transform", function() {
            //         return "translate(" + margin.left + "," + margin.top + ")";
            //     })
            //     .call(yAxis);

            //Draw a grid
            var numberOfTicks = 6;

            var yAxisGrid = yAxis.ticks(numberOfTicks)
                .tickSize(-width, 0)
                .tickFormat("")

            var xAxisGrid = xAxis.ticks(numberOfTicks)
                .tickSize(height, 0)
                .tickFormat("")

            svgContainer.append("g")
                .classed('y', true)
                .classed('grid', true)
                .attr("transform", function() {
                    return "translate(" + margin.left + "," + margin.top + ")";
                })
                .call(yAxisGrid);

            svgContainer.append("g")
                .classed('x', true)
                .classed('grid', true)
                .attr("fill", "none")
                .style("stroke", "red")
                .attr("stroke-width", "1")

                .attr("transform", function() {
                    return "translate(" + margin.left + "," + margin.top + ")";
                })
                .call(xAxisGrid);


            var line = d3.line()
                .x(function(d) {
                    // console.log(d.x, x(new Date(d.x)));
                    return x(new Date(d.x));})
                .y(function(d) {
                    // console.log(d.y, y(d.y));
                    return y(d.y);});

            svgContainer.append("path")
                .classed('weight-line', true)
                .attr("d", line(this.data1))
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", "2")
                .attr("transform", function() {
                    return "translate(" + margin.left + "," + margin.top + ")";
                });

            svgContainer.append("path")
                .classed('target-line', true)
                .attr("d", line(this.data2))
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", "2")
                .attr("transform", function() {
                    return "translate(" + margin.left + "," + margin.top + ")";
                });

        },


    },
    created: function(){

    },
    mounted() {
        //this.load_chart2();
        this.load_chart3();
    },

}
</script>

<style lang="scss">
.weight-chart {
    /* width: 50%; */
    display: inline-block;
	  position: relative;
	  width: 50%;
	  vertical-align: middle;
	  overflow: hidden;
    svg {
	      display: inline-block;
	      position: absolute;
	      top: 0;
	      left: 0;
        background-color: $milife-blue;
        margin: 10px auto;
        .target-line {
            stroke: $milife-orange;
            opacity: 0.7;
        }
        .weight-line {
            stroke: $milife-green;

        }
        path {
            fill: none;
            /* stroke: #76BF8A; */
            /* stroke: red; */
            /* stroke-width: 3px; */
        }
        .x-axis{
            stroke-width: 0px;
        }
        .grid {
            color: lighten(grey,20%);
            opacity: 0.3;

        }
    }
}
</style>
