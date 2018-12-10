
var arrayaux = {};
var arrayfinal = [];

Promise.all([
    d3.csv("maxpoints_country_year_3 columns.csv"),]).then(function(files) {
       createChart(files[0]);
       //nomeQQ(a, files[0]);
       //createSlider()}).catch(function(err) {
        console.log("Error "+err);
})

var margin = {top: 20, right: 20, bottom: 30, left: 40};

function createChart(data) {

    var svg = d3.select("svg"),
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var parseYear = d3.timeParse("%Y");
        bisectDate = d3.bisector(function(d) { return d.year; }).left;

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    var line = d3.line()
        .x(function(d) {return x(d.year); })
        .y(function(d) {return y(d.points);});

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    help = nomeQQ("Spain", data);

    console.log("heeeeeeelp");
    console.log(help[0]);

    var output = Object.keys(help[0]).map(function(key) {
         return {year: key, points: help[0][key]};
      }); 

    console.log(output);

        //x.domain(d3.extent(data, function(d) { return d.year; }));
        x.domain([d3.min(output, function(d) { return d.year; }), d3.max(output, function(d) { return d.year; })]);
        //x.domain([d3.min(data, function(d) { return d.year; }), 1950]);
        y.domain([80, d3.max(output, function(d) { return d.points; })]);

        g.append("g")
            .call(d3.axisBottom(x).ticks(20))        
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .append("text")
            .style("text-anchor", "end")  //ainda nao da para por isto no fim por alguma razao
            .attr("fill", "#5D6971")
            .text("Years");            

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(20))//.tickFormat(function(d) { return parseInt(d / 1000); }))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text("Score");

        g.append("path")
            .data([output])
            .attr("class", "line")
            .attr("d", line);

        var focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);
        focus.append("circle")
            .attr("r", 7.5);

        focus.append("text")
            .attr("x", 15)
          	.attr("dy", ".31em");

        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(output, x0, 1),
              d0 = output[i - 1],
              d1 = output[i],
              d = x0 - d0.year > d1.year - x0 ? d1 : d0;
          console.log("mouseoverrrrrrrrrrrr d.country: " + d.country);
          focus.attr("transform", "translate(" + x(d.year) + "," + y(d.points) + ")");
          focus.select("text").text(function() { return d.points; });
          focus.select(".x-hover-line").attr("y2", height - y(d.points));
          focus.select(".y-hover-line").attr("x2", width + width);
        }
}



function nomeQQ(nomepais, data) {

  for (var b in data) {
    if (data[b].country == nomepais) {
      console.log("entrei no novo if " + data[b].country + " " + data[b].year + " " + data[b].points);
      arrayaux[data[b].year] = data[b].points;
    }
  }

  arrayfinal = [arrayaux];

  return arrayfinal;    

}


/*function createSlider() {

var sslider = d3.select("#slider")
  //.append("svg")
  .attr("width",width + margin.left + margin.right)
  .attr("height",40);

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
  .style("font-size","15px")
  .style('stroke-width', '2px')
  .text(function(d) { return d; })
  .attr("fill", "white");

  var handle = slider.insert("circle", ".track-overlay")
  .attr("class", "handle")
  .attr("r", 9);
}*/