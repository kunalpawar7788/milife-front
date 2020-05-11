<template>
<div class="weight-chart" id="meh" v-bind:style="{ width: width+'px' }">
  <svg id="weightChartSvg"
      :viewBox="viewbox"
      preserveAspectRatio="xMidYMid meet">
    >
  </svg>
</div>

</template>

<script>
import * as d3 from 'd3';
import moment from 'moment'

export default {
    name: 'MiniWeightChart',
    props: ['weight_log', 'height', 'width', 'target_weights', 'show_axes'],
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
    methods: {
        insertLinebreaks:  function (d) {
            var el = d3.select(this);
            var words = d.description.split(' ');
            el.text('');

            for (var i = 0; i < words.length; i++) {
                var tspan = el.append('tspan').text(words[i]);
                if (i > 0)
                    tspan.attr('x', 0).attr('dy', '15');
            }
        },


        load_chart3: function() {
            var numberOfTicks = 6;

            if(this.show_axes){
                var margin = {top: 1, right: 1, bottom: 30, left: 30};
            }
            else {
                var margin = {top: 1, right: 1, bottom: 1, left: 1};
            }

            var width = this.width - margin.left - margin.right,
                height = this.height - margin.top - margin.bottom;

            var x = d3.scaleTime()
                .range([0, width])
                .domain([new Date(this.all_dates[0]), moment(new Date(this.all_dates.slice(-1)[0])).add(5, 'day')]);

            var y = d3.scaleLinear()
                .domain([this.$_.min(this.all_weights), this.$_.max(this.all_weights)+ this.$_.max(this.all_weights)*0.05])
                .range([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)
                .ticks(numberOfTicks)
                .tickFormat(d3.timeFormat("%d %b  %Y"))

            var xMinorAxis = d3.axisBottom()
                .scale(x)
	              .ticks(numberOfTicks)

            var yAxis = d3.axisLeft()
                .scale(y)

            var svgContainer = d3.select("#weightChartSvg");
            // .attr("width", this.width)
            // .attr("height", this.height);
            //.style("border", "1px solid");

            if (this.show_axes) {
                svgContainer.append("g")
                    .classed("x-axis", true)
                    .attr("transform", function() {
                        // console.log(height- margin.bottom)
                        const temp = height +margin.top
                        return "translate(" + margin.left + "," + temp + ")";
                    })
                    .call(xAxis);


                svgContainer.append("g")
                    .classed("y-axis", true)
                    .attr("transform", function() {
                        return "translate(" + margin.left + "," + margin.top + ")";
                    })
                    .call(yAxis);
            }

            //Draw a grid

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

            var insertLinebreaks=  function (d) {
                console.log(d3.select(this).text(), typeof(d), 'bleh');
                var el = d3.select(this);
                var words = d3.select(this).text().split('  ');
                el.text('');

                for (var i = 0; i < words.length; i++) {
                    var tspan = el.append('tspan').text(words[i]);
                    if (i > 0)
                        tspan.attr('x', 0).attr('dy', '10');
                }
            }


            console.log(svgContainer.selectAll('g.x-axis g text'));
            svgContainer.selectAll('g.x-axis g text').each(insertLinebreaks);

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
    display: inline-block;
	  position: relative;
	  /* width: 50%; */
	  vertical-align: middle;
	  overflow: hidden;

    svg {
	      display: inline-block;
	      position: absolute;
	      top: 0;
	      left: 0;
        background-color: $milife-blue;
        margin: 5% auto;
        .target-line {
            stroke: $milife-magenta;
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
