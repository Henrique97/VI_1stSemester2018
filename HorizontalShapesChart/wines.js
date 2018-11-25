var dataset, full_dataset;


d3.csv("wines.csv").then(function(data) {
  dataset = data;
  gen_graph();
});

function gen_graph() {
  var dispatch = d3.dispatch("wineEnter");
  var varieties = [''];
  var years = [];
  var points = [];
  var beginYear = 2000;
  var endYear = 2018;
  for (var k of dataset) {
    if (varieties.indexOf(k.variety.trim()) < 0) varieties.push(k.variety.trim());
    years.push(Number(k.year.trim()));
    points.push(Number(k.points.trim()));
  } 
  categories = varieties;
  var colors = ['#0094ff','#0d4bcf','#0066AE','#BD1E1E','#F5E2C8','#0CF574','#405F83','#FFE066','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

  var tooltip = d3.select("#the_chart")
  .append("div")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .style("color", "white")
  .style("background-color", "#626D71")
  .style("border-radius", "6px")
  .style("text-align", "center")
  .style("font-family", "monospace")
  .style("width", "60px")
  .text("");

  var i;
  var var_objects = [];
  for (i=0; i < years.length; i++) {
    var temp = {category:varieties.indexOf(dataset[i].variety.trim()), year:years[i], color:varieties.indexOf(dataset[i].variety.trim()), points:points[i]};
    var_objects.push(temp);
  }

  var grid = d3.range(25).map(function(i){
    return {'x1':0,'y1':0,'x2':0,'y2':480};
  });
  var tickVals = grid.map(function(d,i){
    if(i>0){ return beginYear + (i/8)*18; }
    else if(i===0){ return "" + beginYear;}
  });

  var xscale = d3.scaleLinear()
          .domain([beginYear, endYear])
          .range([0,722]);

  var yscale = d3.scaleLinear()
          .domain([0,categories.length])
          .range([0,480]);

  var colorScale = d3.scaleQuantize()
          .domain([0,categories.length])
          .range(colors);

  var canvas = d3.select("#the_chart")
                .append("svg")
                .attr("width",900)
                .attr("height",500);
  
  var grid_m = 40.14;

  var grids = canvas.append('g')
            .attr('id','grid')
            .attr('transform','translate(150,10)')
            .selectAll('line')
            .data(grid)
            .enter()
            .append('line')
            .attr('x1', function(d,i){ return i*grid_m; })
            .attr('y1', function(d){ return d.y1; })
            .attr('x2', function(d,i){ return i*grid_m; })		 
            .attr('y2', function(d){ return d.y2; })		 
            .style('stroke', '#adadad')
            .style('stroke-width', '1px');
    

  var	xAxis = d3.axisBottom()
    xAxis
      .scale(xscale)
      .tickValues(d3.range(beginYear, endYear + 1, 1));

  var	yAxis = d3.axisLeft()
    yAxis
      .scale(yscale)
      .tickSize(2)
      .tickFormat(function(d,i){ return categories[i]; })
      .tickValues(d3.range(17));

  var y_xis = canvas.append('g')
            .attr("transform", "translate(150,0)")
            .attr('id','yaxis')
            .call(yAxis);

  var x_xis = canvas.append('g')
            .attr("transform", "translate(150,480)")
            .attr('id','xaxis')
            .call(xAxis);



    //slider

  var margin = {top:0, right:50, bottom:0, left:50},
    width = 960 -margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var sslider = d3.select("#slider")
  .append("svg")
  .attr("width",width + margin.left + margin.right)
  .attr("height",height);

  var x = d3.scaleLinear()
  .domain([1900, 2018])
  .range([0, width])
  .clamp(true);

  var slider = sslider.append("g")
  .attr("class", "slider")
  .attr("transform", "translate(" + margin.left + "," + 40 / 2 + ")");

  slider.append("line")
  .attr("class", "track")
  .attr("x1", x.range()[0])
  .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
  .attr("class", "track-overlay")
  .call(d3.drag()
      .on("start.interrupt", function() { slider.interrupt(); })
      .on("start drag", function() { hue(Math.round(x.invert(d3.event.x)))}));

  slider.insert("g", ".track-overlay")
  .attr("class", "ticks")
  .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(10))
  .enter().append("text")
  .attr("x", x)
  .attr("text-anchor", "middle")
  .text(function(d) { return d; })
  .attr("fill", "white");

  var handle = slider.insert("circle", ".track-overlay")
  .attr("class", "handle")
  .attr("r", 9);

  function hue(h) {
  handle.attr("cx", x(h));
  console.log(h);
  beginYear = h;
  endYear = h +18;

  var_updated = [];
  var i;
  for (i=0; i<var_objects.length;i++) {
    if (beginYear <=var_objects[i].year && var_objects[i].year <= endYear) var_updated.push(var_objects[i]);
  }

  var tickVals = grid.map(function(d,i){
    if(i>0){ return beginYear + (i/8)*18; }
    else if(i===0){ return "" + beginYear;}
  });

  var xscale = d3.scaleLinear()
          .domain([beginYear, endYear])
          .range([0,722]);

  var yscale = d3.scaleLinear()
          .domain([0,categories.length])
          .range([0,480]);

  var	xAxis = d3.axisBottom()
    xAxis
      .scale(xscale)
      .tickValues(d3.range(beginYear, endYear + 1, 1));
      
  var	yAxis = d3.axisLeft()
    yAxis
      .scale(yscale)
      .tickSize(2)
      .tickFormat(function(d,i){ return categories[i]; })
      .tickValues(d3.range(17));

  d3.select("#xaxis").call(xAxis);
  d3.select("#bars").remove();
  var chart = canvas.append('g')
  .attr("transform", "translate(150,0)")
  .attr('id','bars')
  .attr('width', 200)
  .selectAll('circle')
  .data(var_updated)
  .enter()
  .append('circle')
  .attr('cx', 0)
  .attr('cy',0)
  .attr('r',function(d){ return 0; })
  .style('fill',function(d,i){ return colorScale(d.color); })
  .on("mouseover", function(d) {
    var mouse = d3.mouse(this);
    tooltip.html(d.points + " points <br/>");
    return tooltip.style("visibility", "visible")
                  .style("left", (mouse[0] +128) + "px")		
                  .style("top", (mouse[1]+5) + "px");	
  })
  .on("mouseout", function(d) {
    return tooltip.style("visibility", "hidden");});


var transit = d3.select("svg").selectAll("circle")
  .data(var_updated)
  .transition()
  .duration(1200) 
  .attr("r", function(d) {return (d.points-80); })
  .attr('cx', function(d,i){ return xscale(d.year);} )
  .attr('cy',function(d,i){ return yscale(d.category); } );
}
  
hue(2000);
  //end slider
}