var freeze = false;
var currentSelectedCounty;
var currentSelectedCountyFill;
var candidate = "iOS";
//load county infomation
var countyObject;

function loadCountyInfo() {
  countyObject = {};
  d3.csv("https://raw.githubusercontent.com/BonyMedellin/DesarrolloGraficas/main/StateInfo.csv", function(data) {
    data.forEach(function(item) {
      countyObject[item.id] = item;
    });
     //console.log("test",countyObject);
  });
}
loadCountyInfo();

//load candidate infomation
var candidateObject;

function loadCandidateInfo() {
  candidateObject = {};
  d3.csv("https://raw.githubusercontent.com/BonyMedellin/DesarrolloGraficas/main/DatabasSmartphoneBrands.csv", function(data) {
    data.forEach(function(item) {
      candidateObject[item.id] = item;
    });
    console.log("test",candidateObject);
  });
}
loadCandidateInfo();

//color scale
var rateById = d3.map();
var quantize = d3.scale.quantize()
  .domain([0, 1])
  .range(d3.range(10).map(function(i) {
    return "q" + i + "-9";
  }));

//the map
var width = 650,
  height = 500;

var path = d3.geo.path()
  .projection(null);

var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

var legendSize = 20;
var legend = svg.selectAll('.legend')
  .data(d3.range(0, 1, 0.1))
  .enter()
  .append('g')
  .attr('class', quantize)
  .attr('transform', function(d, i) {
    console.log(d);
    var horz = width - 230 + i * legendSize;
    var vert = height - 30;
    return 'translate(' + horz + ',' + vert + ')';
  });

legend.append('rect')
  .attr('width', legendSize)
  .attr('height', legendSize * 0.3)
  .style('stroke', "none");

legend.append('text')
  .attr('x', function(d, i) {
    if (i == 9) {
      return legendSize * 0.6;
    } else {
      return -legendSize * 0.4;
    }
  })
  .attr('y', +legendSize * 0.8)
  .attr('font-size', ".6em")
  .text(function(d, i) {
    if (i % 5 == 0) {
      return (+d * 100) + "%";
    } else if (i == 9) {
      return "100%";
    }

  });
//geojson data
var geoData;

//radio button
$('#radiobtns input').on('change', function() {
  candidate = $('input[name="candidate"]:checked', "#radiobtns").val();
  svg.selectAll(".counties").remove();
  loadCountySvg(svg, geoData);
});

d3.json("https://raw.githubusercontent.com/BonyMedellin/DesarrolloGraficas/main/states.json", function(error, us) {
  if (error) return console.error(error);
  //state
  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) {
      return a !== b;
    }))
    .attr("class", "states")
    .attr("d", path);
  geoData = us;
  //load ratio data for county
  loadCountySvg(svg, geoData);
  //end of loading data
});

function loadCountySvg(svg, geoData) {
  //county
  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(geoData, geoData.objects.states).features)
    .enter().append("path")
    .attr("class", function(d) {
      var ratio = 0;
      if (candidateObject[+d.id] && candidateObject[+d.id][candidate] != "undefined") {
        ratio = candidateObject[+d.id][candidate];
      }
      return quantize(ratio);
    })
    .attr("d", path)
    .on("mouseover", function(d) {
      if (!freeze) {
        //hover
        d3.select(this).style({
          "opacity": 0.3,
          "stroke": "#000"
        });
        //showInfo
        showInfo(d);
      }
    })
    .on("mouseout", function() {
      if (!freeze) {
        // hover
        d3.select(this).style({
          "opacity": 1,
          "stroke": "none"
        });
        //hide countyInfo
        hideInfo();
      }
    })
    .on("click", function() {
      freeze = !freeze;
      svg.style("opacity", freeze ? 0.5 : 1);
      //update selected county if new one is selected
      if (currentSelectedCounty != null) {
        //make the previous normal
        currentSelectedCounty.style({
          "opacity": 1,
          "stroke": "none",
          "fill": currentSelectedCountyFill
        });
      }
      // refer to current one and update the style
      currentSelectedCounty = d3.select(this);
      currentSelectedCountyFill = currentSelectedCounty.style("fill");
      currentSelectedCounty.style({
        "stroke": "#000",
        "opacity": 0.3,
      });
      if (freeze) {
        currentSelectedCounty.style({
          "stroke": "#0A97A1",
          "opacity": 1,
          "fill": "#0A97A1"
        });
      }
    });
}

function showInfo(d) {
  //update
  $('#countyName').html(d.properties.name);
  
  var ratio = 0;
  if (candidateObject[d.id] && candidateObject[d.id][candidate] != "undefined") {
    ratio = candidateObject[d.id][candidate];
  } //console.log(candidateObject[d.id]);
  $('#vote').html((ratio * 100).toFixed(1) + "%");
  if (countyObject) {
    var myInfo = countyObject[d.id];
    $('#population').html(myInfo["Population2014e"]);
    var inputData = {
      _0to15years: +myInfo["_0-15years"],
      _16to25years: +myInfo["_16-25years"],
      _26to35years: +myInfo["_26-35years"],
      _36to50years: +myInfo["_36-50years"],
      MoreThan50years: +myInfo["MoreThan50years"]
    }
    drawRadar(inputData);
  }
  //show
  //console,log(candidateObject[d.id])
  $("#detail").show();
  $("#hint").hide();
}

function hideInfo() {
  $("#detail").hide();
  $("#hint").show();
}

RadarChart.defaultConfig.color = function() {};
RadarChart.defaultConfig.radius = 3;
RadarChart.defaultConfig.w = 350;
RadarChart.defaultConfig.h = 350;
RadarChart.defaultConfig.levels = 3;
RadarChart.defaultConfig.transitionDuration = 250;
RadarChart.defaultConfig.factor = .7;
RadarChart.defaultConfig.factorLegend = .8;
RadarChart.defaultConfig.legendSize = 20;
RadarChart.defaultConfig.levelTick = true;
RadarChart.defaultConfig.axisLine = true;
RadarChart.defaultConfig.circles = true;

var radarData = [{
  className: 'radarInfo', // optional can be used for styling
  axes: [{
    axis: "_0to15years",
    value: 1
  }, {
    axis: "_16to25years",
    value: 1
  }, {
    axis: "_26to35years",
    value: 1
  }, {
    axis: "_36to50years",
    value: 1
  }, {
    axis: "MoreThan50years",
    value: 1
  }]
}];

//Radar Chart

var chart = RadarChart.chart();

chart.config({axisText: true, levels: 5, circles: false});
var cfg = chart.config(); 

var radar = d3.select('#radar').append('svg')
.attr('width', cfg.w + cfg.w + 50)
.attr('height', cfg.h + cfg.h / 2);


var myRadar = radar.append('g').classed('single', 1).datum(radarData).call(chart);

var drawRadar = function(data) {
    radarData[0].axes.forEach(function(axis) {
      axis.value = data[axis.axis];
    });
    myRadar.datum(radarData).call(chart);
  };

$("#detail").hide();
$("#hint").show();