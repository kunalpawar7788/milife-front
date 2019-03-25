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
    data() {
        return {
            data2plot: [99, 71, 78, 25, 36, 92],
            data2: [
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
    methods: {
        load_chart: function() {
            const svg = d3.select('svg')
            //.append('svg')
                  .attr('width', 500)
                  .attr('height', 270)
                  .append('g')
                  .attr('transform', 'translate(0, 10)');
            const x = d3.scaleLinear().range([0, 430]);
            const y = d3.scaleLinear().range([210, 0]);
            d3.axisLeft().scale(x);
            d3.axisTop().scale(y);
            x.domain(d3.extent(this.data2plot, (d, i) => i));
            y.domain([0, d3.max(this.data2plot, d => d)]);
            const createPath = d3.line()
                  .x((d, i) => x(i))
                  .y(d => y(d));
            svg.append('path').attr('d', createPath(this.data2plot));

            var xScale = d3.scaleLinear()
                .domain([0, 10])
                .range([0, axisLength]);

            var yScale = d3.scaleLinear()
                .domain([10, 0])
                .range([0, axisLength]);

            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

        },

        load_chart2: function() {
            var width = 500;
            var height = 500;
            var margin = 25;
            var axisLength = width - 2 * margin;

            var data1 = [
            ];


            var svgContainer = d3.select("svg")
                .attr("width", width)
                .attr("height", height)
                .style("border", "1px solid");

            var xScale = d3.scaleTime()
                .domain([0, 10])
                .range([0, axisLength]);

            var yScale = d3.scaleLinear()
                .domain([10, 0])
                .range([0, axisLength]);

            var xAxis = d3.axisBottom(xScale);
            var yAxis = d3.axisLeft(yScale);

            svgContainer.append("g")
                .classed("x-axis", true)
                .attr("transform", function() {
                    return "translate(" + margin + "," + (height - margin) + ")";
                })
                .call(xAxis);

            svgContainer.append("g")
                .classed("y-axis", true)
                .attr("transform", function() {
                    return "translate(" + margin + "," + margin + ")";
                })

                .call(yAxis);

            var line = d3.line()
                .x(function(d) { return xScale(d.x); })
                .y(function(d) { return yScale(d.y); });

            svgContainer.append("path")
                .attr("d", line(data1))
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("transform", function() {
                    return "translate(" + margin + "," + margin + ")";
                });

            svgContainer.append("path")
                .attr("d", line(data2))
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("transform", function() {
                    return "translate(" + margin + "," + margin + ")";
                });
        },

        load_chart3: function() {

            var margin = {top: 10, right: 10, bottom: 30, left: 30},
                width = 600 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            var x = d3.scaleTime()
                .range([0, width])
                .domain([new Date(this.data2[0].x), new Date(this.data2.slice(-1)[0]['x'])]);

            var y = d3.scaleLinear()
                .domain([0, 110])
                .range([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)

            var xMinorAxis = d3.axisBottom()
                .scale(x)
	              .ticks(d3.timeHours,12)

            var yAxis = d3.axisLeft()
                .scale(y)


            var svgContainer = d3.select("svg")
                .attr("width", 600)
                .attr("height", 400)
                .style("border", "1px solid");

            svgContainer.append("g")
                .classed("x-axis", true)
                .attr("transform", function() {
                    console.log(height- margin.bottom)
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
                    console.log(d.x, x(new Date(d.x)));
                    return x(new Date(d.x));})
                .y(function(d) {
                    console.log(d.y, y(d.y));
                    return y(d.y);});

            svgContainer.append("path")
                .attr("d", line(this.data2))
                .attr("fill", "none")
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
