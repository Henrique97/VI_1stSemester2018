var dataset, full_dataset;


d3.csv("wines.csv").then(function(data) {
  dataset = data;
  gen_graph();
});

function gen_graph() {
  
/*
  var w = 600;
  var h = 600;

  var categories = ["Abouriou", "Agiorgitiko", "Aglianico", "Aidani", "Airen"];
  var dollars = [213,209,190,179,156,209,190,179,213,209,190,179,156,209,190,190];
  
  var svg = d3.select("#the_chart")
              .append("svg")
              .attr("width",w)
              .attr("height",h);

  var padding = 30;
  var bar_w = 15;

  var fruitMenu = d3.select("#secod_chart");

  fruitMenu.append("select")
         .selectAll("option")
         .data(categories)
         .enter()
         .append("option")
         .attr("value", function(d){console.log(d); return d;})
         .text(function(d){return d;});

*/


  var varieties = [''];
  var prices = [];
  var points = [];
  var beginYear = 2000;
  var endYear = 2018;
  for (var k of dataset) {
    if (varieties.indexOf(k.variety.trim()) < 0) varieties.push(k.variety.trim());
    prices.push(Number(k.year.trim()));
    points.push(Number(k.points.trim()));
  } 
  categories = varieties;
  var colors = ['#0094ff','#0d4bcf','#0066AE','#BD1E1E','#F5E2C8','#0CF574','#405F83','#FFE066','#4D7069','#6E9985','#7EBC89','#0283AF','#79BCBF','#99C19E'];

  var i;
  var var_objects = [];
  for (i=0; i < prices.length; i++) {
    var temp = {category:varieties.indexOf(dataset[i].variety.trim()), price:prices[i], color:varieties.indexOf(dataset[i].variety.trim()), points:points[i]};
    var_objects.push(temp);
  }


  //var_objects.push({category:1, price:dollars[2], color:1});
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
  /*
  var svg = d3.select("svg"),
  margin = {right: 50, left: 50},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height");*/

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
    if (beginYear <=var_objects[i].price && var_objects[i].price<= endYear) var_updated.push(var_objects[i]);
  }
  console.log(var_updated);
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
  console.log(var_updated);
  var chart = canvas.append('g')
  .attr("transform", "translate(150,0)")
  .attr('id','bars')
  .attr('width', 200)
  .selectAll('circle')
  .data(var_updated)
  .enter()
  .append('circle')
  //.attr('cx', function(d,i){ return xscale(d.price);} )
  .attr('cx', 0)
  .attr('cy',0)
  //.attr('r', 6)
  .attr('r',function(d){ return 0; })
  .style('fill',function(d,i){ return colorScale(d.color); });

var transit = d3.select("svg").selectAll("circle")
  .data(var_updated)
  .transition()
  .duration(1200) 
  .attr("r", function(d) {return (d.points-80); })
  .attr('cx', function(d,i){ return xscale(d.price);} )
  .attr('cy',function(d,i){ return yscale(d.category); } );


/*
  d3.select("#bars").selectAll("circle")
    .data(var_updated)
    .enter()
    .selectAll('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r',function(d){ return 0; })
    .style('fill',function(d,i){ return colorScale(d.color); });

  d3.select("#bars").selectAll("circle")
    .data(var_updated)
    .transition()
    .duration(1200) 
    .attr("r", function(d) {return (d.points-80); })
    .attr('cx', function(d,i){ return xscale(d.price);} )
    .attr('cy',function(d,i){ return yscale(d.category); } );
    
  var y_xis = canvas.append('g')
            .attr("transform", "translate(150,0)")
            .attr('id','yaxis')
            .call(yAxis);

  var x_xis = canvas.append('g')
            .attr("transform", "translate(150,480)")
            .attr('id','xaxis')
            .call(xAxis);*/
  }
  hue(2000);
  //end slider

 
/*
  //Adiciona as barras
    var chart = canvas.append('g')
            .attr("transform", "translate(150,0)")
            .attr('id','bars')
            .selectAll('rect')
            .data(dollars)
            .enter()
            .append('rect')
            .attr('height',19)
            .attr('x', 0)
            .attr('y',function(d,i){ return yscale(i)+19; } )
            .style('fill',function(d,i){ return colorScale(i); })
            .attr('width',function(d){ return 0; });

  var transit = d3.select("svg").selectAll("rect")
              .data(dollars)
              .transition()
              .duration(1000) 
              .attr("width", function(d) {return xscale(d); });

  //Adiciona texto as barras
  var transitext = d3.select('#bars')
            .selectAll('text')
            .data(dollars)
            .enter()
            .append('text')
            .attr('x', function(d) {return xscale(d)-200; })
            .attr('y', function(d,i){ return yscale(i)+35; })
            .text(function(d){ return d+"$"; }).style({'fill':'#fff','font-size':'14px'});
*/


}

function gen_scatterplot() {
    var w = 600;
    var h = 300;
    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h)
    			.attr("fill", "blue");
	var dispatch = d3.dispatch("varietyEnter");
    var selectedCircle;
    var padding =30;
    var bar_w = 15;
    var r = 5;
    dispatch.on("varietyEnter.scatterplot", function(wine){
      selectedCircle = d3.select("circle[title=\'" + wine.variety + "\']")
      selectedCircle.attr("fill", "red");})

    var hscale = d3.scaleLinear()
                         .domain([70,0])
                         .range([padding,h-padding]);

    var xscale = d3.scaleLinear()
                       .domain([2000,d3.max(dataset, function(d) {
            			return d.year;})])
                       .range([padding,w-padding]);

    var yaxis = d3.axisLeft()
                  .scale(hscale);

    var xaxis = d3.axisBottom()
  				.scale(xscale)
              	.ticks(dataset.length/2);

    var cscale = d3.scaleLinear()
         .domain([d3.min(dataset, function(d) { return d.year;}),
                  d3.max(dataset, function(d) { return d.year;})])
         .range(["red", "blue"]);


   gY = svg.append("g")
    .attr("transform","translate(30,0)")
  .attr("class","y axis")
  .call(yaxis);


    gX = svg.append("g")
    .attr("transform","translate(0," + (h-padding) + ")")
  .call(xaxis);

   svg.selectAll("circle")
       .data(dataset)
     .enter().append("circle")
       .attr("r",r)
       .attr("fill","purple")
       .attr("cx",function(d, i) {
                        return  xscale(d.year);})
       .attr("cy",function(d) {
                 return hscale(d.price);
                 })
       .attr("title", function(d) {return d.variety;})
       .on("mouseover", function(d) {dispatch.call("varietyEnter",d,d);});

}