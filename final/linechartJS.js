var arrayaux = {};
var arrayfinal = [];
var selected_country = "Portugal";
var selected_country2 = "US";
var mycsv = "maxpoints_country_year_3 columns.csv";
var fromYear = 1950;
var toYear = 2017;

var country_list = ["Argentina", "Armenia", "Australia", "Austria", "Bosnia an", "Brazil", "Bulgaria", "Canada", "Chile", "China", "Croatia", "Cyprus",
    "Czech Rep", "Egypt", "England", "France", "Georgia", "Germany", "Greece", "Hungary", "India", "Israel", "Italy", "Lebanon", "Luxembour", "Macedonia",
    "Mexico", "Moldova", "Morocco", "New Zeala", "Peru", "Portugal", "Romania", "Serbia", "Slovakia", "Slovenia", "South Afr", "Spain", "Switzerla", "Turkey",
    "Ukraine", "Uruguay", "US"
];

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};

//CRIAR COUNTRY LIST
/*d3.csv("countrylistexcel.csv", function(d) {
  //justaHelp(d);
  country_list = d;
});


var country_list = d3.csvParseRows("countrylistexcel.csv", function(data, i) {
  return {country: data[0]};
}); 

  
  console.log("hehehehehe " + country_list.length);
function justaHelp(data) {
  for (var a in data) {
    console.log("bubububububu " + a);
    country_list.push(a);
  }
}


*/

startDoingThings(mycsv, selected_country, fromYear, toYear);

function startDoingThings(mycsv/*, pais, fromYear, toYear*/) {
    d3.select("#linechart").selectAll("*").remove();
    Promise.all([
        d3.csv(mycsv),
    ]).then(function(files) {
        createChart(files[0], selected_country, selected_country2, fromYear, toYear);
        //createChart(files[0], pais);
    })

}

//function createChart(data, country, fromYear, toYear) {
function createChart(data, country, country2, fromYear, toYear) {

    var svg = d3.select("#linechart"),
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var parseYear = d3.timeParse("%Y");
    bisectDate = d3.bisector(function(d) {
        return d.year;
    }).left;

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    
    var line = d3.line()
        .x(function(d) {
            if(d.year>=x.domain()[0].getFullYear())
            {
                return x(parseYear(d.year));
            }
            return parseYear(x.domain()[0].getFullYear());
        })
        .y(function(d) {
            if(d.year>=x.domain()[0].getFullYear())
            {
                return y(d.points);
            }
            return 0;
        });

    var line2 = d3.line()
        .x(function(d) {
            if(d.year>=x.domain()[0].getFullYear())
            {
                return x(parseYear(d.year));
            }
            return parseYear(x.domain()[0].getFullYear());
        })
        .y(function(d) {
            if(d.year>=x.domain()[0].getFullYear())
            {
                return y(d.points);
            }
            return 0;
        });


    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    helper = filter_data_by_country(country, data);

    var output = Object.keys(helper[0]).map(function(key) {
        return {
            year: key,
            points: helper[0][key]
        };
    });
    
    helper = filter_data_by_country(country2, data);

    var output2 = Object.keys(helper[0]).map(function(key) {
        return {
            year: key,
            points: helper[0][key]
        };
    });

    //x.domain(fromYear, toYear);
/*    */
    x.domain([d3.max([d3.min(output, function(d) {
        return parseYear(d.year);
    }),d3.min(output2, function(d) {
        return parseYear(d.year);
    })]), d3.min([d3.max(output2, function(d) {
        return parseYear(d.year);
    }),d3.max(output, function(d) {
        return parseYear(d.year);
    })])]);



    y.domain([80, 100]);


    g.append("g")
        .call(d3.axisBottom(x).ticks(5))
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Years")
        .attr("x","330px")
        .attr("y","-10px");
    

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(5)) //.tickFormat(function(d) { return parseInt(d / 1000); }))
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Score");
    
    newoutput=[];
    output.forEach(function(d){
            if(d.year>=x.domain()[0].getFullYear())
            {
                newoutput.push(d);
            }
        });

    g.append("path")
        .data([newoutput])
        .attr("class", "line")
        .style("stroke","rgba(46, 46, 253,0.507)")
        .attr("d", line);

    newoutput=[]
    output2.forEach(function(d){
        if(d.year>=x.domain()[0].getFullYear())
        {
            newoutput.push(d);
        }
    });
    g.append("path")
        .data([newoutput])
        .attr("class", "line")
        .style("stroke", "rgba(255, 15, 15, 0.507)")
        .attr("d", line2);
    
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

/*
    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        /*.on("mouseover", function() {
            focus.style("display", null);
        })
        .on("mouseout", function() {
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);*/

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(output, x0, 1),
            d0 = output[i - 1],
            d1 = output[i],
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        //console.log("mouseover!!!! d.country: " + d.country);
        focus.attr("transform", "translate(" + x(d.year) + "," + y(d.points) + ")");
        focus.select("text").text(function() {
            return d.points;
        });
        focus.select(".x-hover-line").attr("y2", height - y(d.points));
        focus.select(".y-hover-line").attr("x2", width + width);
    }
}


function filter_data_by_country(nomepais, data) {
    arrayaux = {};
    for (var b in data) {
        if (data[b].country == nomepais) {
            //console.log("entrei no novo if " + data[b].country + " " + data[b].year + " " + data[b].points);
            arrayaux[data[b].year] = data[b].points;
        }
    }

    arrayfinal = [arrayaux];

    return arrayfinal;
}


/*
var dropmenu = d3.select("qqstuff")
                .attr("style","display:inline")
                .attr("multiple","multiple")
                .attr("size",country_list.length)
                .attr("width",100)


for (var i = country_list.length - 1; i >= 0; i--) {
    dropmenu.append("option").attr("value",country_list[i]).text(country_list[i]);
    console.log("bubuhehe " + country_list[i]);
}


dropmenu.on('click',function(d){
        var selector = document.getElementById('qqstuff');
        var value = selector[selector.selectedIndex].value;
        console.log(value);
        });
        */

//x.domain([d3.min(output, function(d) { return d.year; }), d3.max(output, function(d) { return d.year; })]);