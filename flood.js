$(document).ready(function() {
    drawTaiwan()
   });
  
 function drawTaiwan(){

var width = 1024;
var height = 700;

var rateById = {};
var nameById = {};

var color_domain = [5, 10, 15, 25, 35]
  var ext_color_domain = [0, 5, 10, 15, 25, 35]
  var legend_labels = ["< 5", "5+", "10+", "15+", "25+", "> 35"]              
  

var color = d3.scale.threshold()
  .domain(color_domain)
  .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);


var div = d3.select("body").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

 var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("margin", "10px auto");

 var projection = d3.geo.mercator()
 .center([121,24])
 .scale(8000)
 .translate([width / 2, height / 2]);

 var path = d3.geo.path().projection(projection);

 d3.csv("http://elsiehsieh.github.io/disastermap/disaster.csv", function(data){

  d3.json("sector.js", function(error, town){
    for (var i=0; i< data.length; i++){
      var dataTown = data[i].Town_ID;
      var dataValue = data[i].flood;

      for(var j=0; j<town.objects.sector.geometries.length;j++){
        var jsonTown = town.objects.sector.geometries[j].properties.Town_ID;

        if(dataTown==jsonTown){
          town.objects.sector.geometries[j].properties.flood = dataValue
          break;
        }

      }
    }
  
  var sectortown = topojson.feature(town, town.objects.sector);

  svg.append("g")
    .attr("class", "sector")
    .selectAll("path")
    .data(topojson.feature(town, town.objects.sector).features)
    .enter().append("path")
    .attr("d", path)
    .style("fill", function(d) {
     var Flood = d.properties.flood;
      if (Flood) {
                   return color(Flood);
      } else {
                   return "#ddd";
    }})
    .style("opacity", 0.8)

    .on("mouseover", function(d) {
      d3.select(this).transition().duration(300).style("opacity", 1);
      div.transition().duration(300)
      .style("opacity", 1)
      div.text(d.properties.T_Name+ " ─ 洪災數量：" + d.properties.flood) //+ " : " + rateById[d.TOWN_ID] d.properties.T_Name
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY -30) + "px");
    })
    .on("mouseout", function() {
      d3.select(this)
      .transition().duration(300)
      .style("opacity", 0.8);
      div.transition().duration(300)
      .style("opacity", 0);
    })

  });
});

  var legend = svg.selectAll("g.legend")
    .data(ext_color_domain)
    .enter().append("g")
    .attr("class", "legend");

  var ls_w = 20, ls_h = 20;

    legend.append("rect")
      .attr("x", 20)
    .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
    .attr("width", ls_w)
    .attr("height", ls_h)
    .style("fill", function(d, i) { return color(d); })
    .style("opacity", 0.8);

  legend.append("text")
    .attr("x", 50)
    .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
    .text(function(d, i){ return legend_labels[i]; });

}