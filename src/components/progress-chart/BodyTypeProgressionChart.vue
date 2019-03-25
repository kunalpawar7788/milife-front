<template>
<div class="bodytypechart-container">
  
  <svg :width="canvas_width" :height="canvas_width">
    <g>
      <line v-for="(d, index_gridlines) in gridlines"
            :key="index_gridlines"
            v-bind:x1="x(d.x1)"
            v-bind:y1="y(d.y1)"
            v-bind:x2="x(d.x2)"
            v-bind:y2="y(d.y2)"
            stroke="gray"
            storke-width="2"
            v-bind:transform="translator"
            >
      </line>
    </g>
    
    
    <text v-for="(d, index_labels) in labels"
          :key="index_labels"
          class="labels"
          v-bind:y="y((d.y1+d.y2+d.text.length*1.7)/2)"
          v-bind:transform="translator"
          >
      <tspan v-for="(part, index_text) in d.text"
             :key="index_text"
             v-bind:x="x((d.x1+d.x2)/2)"
             dy="11px"
             >
        {{part}}
      </tspan>

    </text>
    <g>
      <circle v-for="(d, index_coords) in coords"
              :key="index_coords"
              v-bind:cx="d.x"
              v-bind:cy="d.y"
              v-bind:r="2"
              fill="white"
              stroke="red"
              stroke-width="1"
              v-bind:transform="translator"
              >
      </circle>
    </g>
    
  </svg>
</div>
</template>

<script>
import * as d3 from 'd3';

export default{
    name: "BodyTypeProgressionChart",
    data() {
        return {
            datapoints: [
                {date: "2018-08-08", bmi: 25, bfp: 30},
                {date: "2018-11-08", bmi: 0, bfp: 25},
                {date: "2018-11-08", bmi: 27, bfp: 27},
                {date: "2018-09-08", bmi: 29, bfp: 20},
                {date: "2018-10-08", bmi: 35, bfp: 30},
                {date: "2018-11-08", bmi: 21, bfp: 20},
            ],
            canvas_width: 300,
            canvas_height: 300,
            margin: {top: 10, right: 10, bottom: 30, left: 30},
            margin_top: 10,
            margin_left: 30,
            margin_bottom: 30,
            margin_right: 10,
            min_x: 10,
            max_x: 40,
            gender: "F",
            
            grid_m:[
                {x1: 10, y1: 15, x2: 40, y2:15},
                {x1: 10, y1: 20, x2: 40, y2:20},
                {x1: 10, y1: 25, x2: 40, y2:25},
                {x1: 10, y1: 30, x2: 40, y2:30},
                
                {x1: 25, y1: 5,  x2: 25, y2:40},
                {x1: 30, y1: 5,  x2: 30, y2:40},
                {x1: 18.5, y1: 5, x2:18.5, y2:40},
                
                {x1: 10, y1: 40, x2:40, y2:40},
                {x1: 40, y1: 5, x2:40, y2:40},
            ],
            
            grid_f:[
                {x1: 10, y1: 20, x2: 40, y2:20},
                {x1: 10, y1: 30, x2: 40, y2:30},
                {x1: 10, y1: 35, x2: 40, y2:35},
                {x1: 10, y1: 40, x2: 40, y2:40},
                {x1: 25, y1: 10,  x2: 25, y2:50},
                {x1: 30, y1: 10,  x2: 30, y2:50},
                {x1: 18.5, y1: 10, x2:18.5, y2:50},
                
                {x1: 10, y1: 50,  x2: 40, y2:50},
                {x1: 40, y1: 10,  x2: 40, y2:50},
            ],
            
            labels_m: [
                {x1: 10, y1: 40, x2:18.5, y2: 30, text: ["Skinny fat", "class 2"]},
                {x1: 18.5, y1: 40, x2: 25, y2: 30, text: ["Overfat", "Class 3"]},
                {x1: 25, y1: 40, x2:30, y2: 30, text: ["Obesity", "Class 2"]},
                {x1: 30, y1: 40, x2:40, y2: 30, text: ["Obesity Class 3"]},
                
                {x1: 10,   y1: 30, x2:18.5, y2: 25, text: ["Skinny fat", "class 1"]},
                {x1: 18.5, y1: 30, x2: 25,  y2: 25, text: ["Overfat", "Class 2"]},
                {x1: 25,   y1: 30, x2:30,   y2: 25, text: ["Obesity", "Class 1"]},
                {x1: 30,   y1: 30, x2:40,   y2: 25, text: ["Obesity Class 2"]},
                
                {x1: 10,   y1: 25, x2:18.5, y2: 20, text: ["Lack of muscle"]},
                {x1: 18.5, y1: 25, x2: 25,  y2: 20, text: ["Overfat", "Class 1"]},
                {x1: 25,   y1: 25, x2:30,   y2: 20, text: ["Pre-","obesity"]},
                {x1: 30,   y1: 25, x2:40,   y2: 20, text: ["Obesity Class 1"]},
                
                {x1: 10,   y1: 20, x2:18.5, y2: 15, text: ["Underweight"]},
                {x1: 18.5, y1: 20, x2: 25,  y2: 15, text: ["Standard"]},
                {x1: 25,   y1: 20, x2:30,   y2: 15, text: ["Muscular", 'Overweight', "Level 1"]},
                {x1: 30,   y1: 20, x2:40,   y2: 15, text: ["Muscular", "Overweight", "Level 2"]},
                
                {x1: 10,   y1: 15, x2:18.5, y2: 5, text: ["Underweight", "Low fat"]},
                {x1: 18.5, y1: 15, x2: 25,  y2: 5, text: ["Fit"]},
                {x1: 25,   y1: 15, x2:30,   y2: 5, text: ["Muscular"]},
                {x1: 30,   y1: 15, x2:40,   y2: 5, text: ["Athelete"]},
            ],
            
            labels_f: [
                {x1: 10,   y1: 50, x2:18.5, y2: 40, text: ["Skinny fat", "class 2"]},
                {x1: 18.5, y1: 50, x2:25,   y2: 40, text: ["Overfat", "Class 3"]},
                {x1: 25,   y1: 50, x2:30,   y2: 40, text: ["Obesity", "Class 2"]},
                {x1: 30,   y1: 50, x2:40,   y2: 40, text: ["Obesity Class 3"]},
                
                {x1: 10,   y1: 40, x2:18.5, y2: 35, text: ["Skinny fat", "class 1"]},
                {x1: 18.5, y1: 40, x2:25,   y2: 35, text: ["Overfat", "Class 2"]},
                {x1: 25,   y1: 40, x2:30,   y2: 35, text: ["Obesity", "Class 1"]},
                {x1: 30,   y1: 40, x2:40,   y2: 35, text: ["Obesity Class 2"]},
                
                {x1: 10,   y1: 35, x2:18.5, y2: 30, text: ["Lack of muscle"]},
                {x1: 18.5, y1: 35, x2:25,   y2: 30, text: ["Overfat", "Class 1"]},
                {x1: 25,   y1: 35, x2:30,   y2: 30, text: ["Pre-","obesity"]},
                {x1: 30,   y1: 35, x2:40,   y2: 30, text: ["Obesity Class 1"]},
                
                {x1: 10,   y1: 30, x2:18.5, y2: 20, text: ["Underweight"]},
                {x1: 18.5, y1: 30, x2:25,   y2: 20, text: ["Standard"]},
                {x1: 25,   y1: 30, x2:30,   y2: 20, text: ["Muscular", 'Overweight', "Level 1"]},
                {x1: 30,   y1: 30, x2:40,   y2: 20, text: ["Muscular", "Overweight", "Level 2"]},
                
                {x1: 10,   y1: 20, x2:18.5, y2: 10, text: ["Underweight", "Low fat"]},
                {x1: 18.5, y1: 20, x2:25,   y2: 10, text: ["Fit"]},
                {x1: 25,   y1: 20, x2:30,   y2: 10, text: ["Muscular"]},
                {x1: 30,   y1: 20, x2:40,   y2: 10, text: ["Athelete"]},
                
            ],
            
        }
    },
    components: {},
    computed: {
        gridlines: function(){return this.gender==='F'? this.grid_f: this.grid_m},
        labels: function(){return this.gender==='F'? this.labels_f: this.labels_m},
        width: function(){return this.canvas_width - this.margin_left - this.margin_right;},
        height: function(){return this.canvas_height - this.margin_top - this.margin_bottom;},
        
        min_y: function(){return this.gender==="F"? 10 : 5},
        max_y: function(){return this.gender==="F"? 50 : 40},
        
        coords: function(){
            return this.datapoints.map(node => {
                return {
                    x: d3.scaleLinear().domain([this.min_x, this.max_x]).range([0,this.width])(node.bmi),
                    y: d3.scaleLinear().domain([this.min_y, this.max_y]).range([this.height,0])(node.bfp)
                }
            })
        },
        translator: function(){return "translate(" + this.margin_left + "," + this.margin_top + ")"},
        
        x_axis: function(){return d3.axisBottom().scale(
            d3.scaleLinear().domain([this.min_x, this.max_x]).range([0, this.width])
        )},
        y_axis: function(){return d3.axisLeft().scale(
            d3.scaleLinear().domain([this.min_y, this.max_y]).range([this.height, 0])
        )},
        
        // margin: function(){
        //     return {top: 10, right: 10, bottom: 30, left: 30};
        // },
        
        // scaled_grid_m: function(){
        //     return 12
        // },
        
    },
    
    methods: {
        x: function(value){
            return d3.scaleLinear().domain([this.min_x, this.max_x]).range([0, this.width])(value)
        },
        y: function(value){
            return d3.scaleLinear().domain([this.min_y, this.max_y]).range([this.height, 0])(value)
        },
        
        load_axes: function() {
            var svgContainer = d3.select("svg");
            svgContainer.append("g")
                .classed("x-axis", true)
                .attr("transform", function() {
                    // console.log(height- margin.bottom)
                    const temp = this.height + this.margin.top
                    return "translate(" + this.margin.left + "," + temp + ")";
                }.bind(this))
                .call(this.x_axis);
            
            svgContainer.append("g")
                .classed("y-axis", true)
                .attr("transform", function() {
                    return "translate(" + this.margin.left + "," + this.margin.top + ")";
                }.bind(this))
                .call(this.y_axis);
            
        },
        
        load_plot: function(){
            var svgContainer = d3.select("svg");
            var line = d3.line()
                .x(function(d) {
                    console.log('x', this.x);
                    return this.x(d.bmi)}
                   .bind(this))
                .y(function(d) {
                    //console.log(d.y, y(d.y));
                    return this.y(d.bfp)}.bind(this));
            
            svgContainer.append("path")
                .classed("line-chart", true)
                .attr("d", line(this.datapoints))
                .attr("transform", function() {
                    return "translate(" + this.margin.left + "," + this.margin.top + ")";
                }.bind(this));
            
            
        },
        load_chart: function(d) {
            
            var canvas_width = 300;
            let canvas_height =  300;
            
            var margin = {top: 10, right: 10, bottom: 30, left: 30},
                width = canvas_width - margin.left - margin.right,
                height = canvas_height - margin.top - margin.bottom;
            
            var max_bmi = Math.ceil(Math.max.apply(Math, d.map(function(o) { return o.bmi; }))/10) * 10;
            var min_bmi = Math.floor(Math.min.apply(Math, d.map(function(o) { return o.bmi; }))/10) * 10;
            
            var x = d3.scaleLinear()
                .domain([min_bmi, max_bmi])
                .range([0,width])
            
            var dummy = d3.scaleLinear().domain([this.min_bmi, this.max_bmi]).range([0,this.width]);
            // console.log('this here>>>', dummy(10), this.min_bmi, this.max_bmi, this.width);

            var max_bfp = Math.ceil(Math.max.apply(Math, d.map(function(o) { return o.bfp; }))/10) * 10;
            var min_bfp = Math.floor(Math.min.apply(Math, d.map(function(o) { return o.bfp; }))/10) * 10;

            var y = d3.scaleLinear()
                .domain([min_bfp, max_bfp])
                .range([height,0])

            var xAxis = d3.axisBottom()
                .scale(x)

            var xMinorAxis = d3.axisBottom()
                .scale(x)
                .ticks(d3.timeHours,12)

            var yAxis = d3.axisLeft()
                .scale(y)


            var svgContainer = d3.select("svg")
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
                    //console.log(d.x, x(new Date(d.x)));
                    return x(d.bmi)})
                .y(function(d) {
                    //console.log(d.y, y(d.y));
                    return y(d.bfp);});

            // var points = d3.circle()
            //     .x(function(d) {return x(d.bmi)})
            //     .y(function(d) {return y(d.bfp)})

            svgContainer.append("path")
                .classed("line-chart", true)
                .attr("d", line(d))
                .attr("fill", "none")
                .attr("transform", function() {
                    return "translate(" + margin.left + "," + margin.top + ")";
                });

            // svgContainer.append("circle")
            //     .data(d)
            //     .attr("cx", function(dd){
            //         console.log("bleh>>>",dd.bmi, x(dd.bmi));
            //         return x(dd.bmi);})
            //     .attr("cy", function(d){return y(d.bfp)})
            //     .attr("r", 10)

            //     .attr("transform", function() {
            //         return "translate(" + margin.left + "," + margin.top + ")";
            //     });

        }
    },
    mounted() {
        // console.log('>>> here');
        this.load_axes();
        this.load_plot();
        //this.load_chart(this.datapoints);
    },
}
</script>

<style lang="scss">
.line-chart {
    color: blue;
    stroke: blue;
    
}
.bodytypechart-container {
    svg {
        margin: 25px;
        background-color: darken($milife-blue, 10%);
        
        path {
            fill: none;
            /* stroke: #76BF8A; */
            stroke: grey;
            stroke-width: 1px;
        }
        .line-chart{
            fill: none;
            stroke: red;
            stroke-width: 1px;
        }
        .labels{
            text-anchor: middle;
            font-size: 10px;
            fill: white;
            stroke: none;
        }
    }
}

</style>
