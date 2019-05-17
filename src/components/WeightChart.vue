<template>
<div class="weight-chart">
  <svg>
  </svg>
</div>
</template>

<script>
import * as d3 from 'd3';

export default {
    name: 'WeightChart',
    props: ['data', 'height', 'width', 'target_weights'],
    data() {
        return {
            data2plot: [99, 71, 78, 25, 36, 92],
            data3: [
                {x: '2018-01-15', y: 70.3},
                {x: '2018-01-22', y: 72.5},
                {x: '2018-03-08', y: 75},
                {x: '2018-03-08', y: 77.4},
                {x: '2018-04-13', y: 80.0},
                {x: '2018-04-13', y: 95.0},
                {x: '2018-06-13', y: 90.3},
                {x: '2018-06-13', y: 89.4},
                {x: '2018-08-02', y: 80.0},
                {x: '2018-08-02', y: 100.6},
                {x: '2018-09-26', y: 60.8},
                {x: '2018-09-26', y: 85.3}
            ],
        }
    },
    computed: {
        data2() {
            var d = [];
            for(var i=0; i<this.data.length; i++){
                d.push({x: this.data[i].measured_on, y: this.data[i].weight})
            }
            return this.$_.orderBy(d, 'x');
        },

        target_data(){

        },
        all_dates() {
            var d= [];
            for(var i=0; i<this.data.length; i++){
                d.push(this.data[i].measured_on);
            }
            for(var i=0; i<this.target_weights.length; i++){
                d.push(this.target_weights[i].x);
            }
            // console.log(d);
            // console.log(d.sort());

            return d.sort();
        }
    },
    methods:{

        load_chart3: function() {

            var margin = {top: 10, right: 10, bottom: 30, left: 30},
                width = this.width - margin.left - margin.right,
                height = this.height - margin.top - margin.bottom;

            var x = d3.scaleTime()
                .range([0, width])
                .domain([new Date(this.all_dates[0]), new Date(this.all_dates.slice(-1)[0])]);

            var y = d3.scaleLinear()
                .domain([40, 100])
                .range([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)

            var xMinorAxis = d3.axisBottom()
                .scale(x)
	              .ticks(d3.timeHours,12)

            var yAxis = d3.axisLeft()
                .scale(y)


            var svgContainer = d3.select("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .style("border", "1px solid");

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

            var line = d3.line()
                .x(function(d) {
                    // console.log(d.x, x(new Date(d.x)));
                    return x(new Date(d.x));})
                .y(function(d) {
                    // console.log(d.y, y(d.y));
                    return y(d.y);});

            svgContainer.append("path")
                .attr("d", line(this.data2))
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", "2")
                .attr("transform", function() {
                    return "translate(" + margin.left + "," + margin.top + ")";
                });

            svgContainer.append("path")
            .attr("d", line(this.target_weights))
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", "3")
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
    .weightchart {
        svg {
            margin: 25px;
            background-color: darken($milife-blue, 10%);

            path {
                fill: none;
                /* stroke: #76BF8A; */
                stroke: red;
                stroke-width: 3px;
            }
        }
    }
</style>
