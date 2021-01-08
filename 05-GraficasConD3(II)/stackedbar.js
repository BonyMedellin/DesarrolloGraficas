graf = d3.select('#graf')

ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 15

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

margins = { top: 10, left: 15, right: 15, bottom: 100 }
padding = 20
ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

anchogrid = ancho - margins.right

// II. Variables globales
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

// BARRAS
g = svg.append('g')
        .style('transform', `translate(${ margins.left }px, ${ margins.top }px)`)
        .style('width', ancho + 'px')
        .style('height', alto + 'px')

y = d3.scaleLinear()
          .range([alto, 0])

dataArray = []

function render(data) {

// Horizontal Scroll

// EJE X

    xScale = d3.scaleBand()
               .range([0, ancho])
             //.rangeRound([margins.left,ancho])
               .padding(0.4);

    xScale.domain(data.map(function(d){ return d.Platform}));

    xAxis = d3.axisBottom(xScale);

    g.append('g')
     .attr('class', 'x axis')
     .attr('transform', 'translate(35,'+ alto+')')
     .call(xAxis)
     .selectAll('text')
     .attr('dx', '09px')
     .attr('transform', 'rotate(90)')
   //.attr('transform', 'translate(0,1)')
     .style('text-anchor', 'start')
   //.style('le')
     ;
    //console.log(dataArray)
}

// CARGA BASE DE DATOS
d3.csv('vgsales.csv')
    .then(function(data) {
      data.forEach(d => {
        d.rank = +d.rank
        d.year = +d.year
        d.NA_Sales = +d.NA_Sales
        d.EU_Sales = +d.EU_Sales
        d.JP_Sales = +d.JP_Sales
        d.Other_Sales = +d.Other_Sales
        d.Global_Sales = +d.Global_Sales
      })
    
      this.dataArray = data
    
      // Calcular la altura más alta dentro de
      // los datos (columna "oficial")
      maxy = d3.max(data, d => d.Global_Sales)
      miny = d3.min(data, d => d.Global_Sales)
      
      // Creamos una función para calcular la altura
      // de las barras y que quepan en nuestro canvas
      y.domain([0, maxy])
    
      // V. Despliegue
      render(dataArray)
    })
    .catch(e => {
      console.log('No se tuvo acceso al archivo ' + e.message)
    })


/*svg = d3.select("svg")
margin = {top: 20, right: 20, bottom: 30, left: 40}
width = svg.attr("width") - margin.left - margin.right
height = svg.attr("height") - margin.top - margin.bottom
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

dataArray = []
// set x scale
x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1)

// set y scale
y = d3.scaleLinear()
    .rangeRound([height, 0])

// set the colors
z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])


// load the csv and create the chart
function render(data) {

  //var keys = data.columns.slice(1);

  data.sort(function(a, b) { return b.Global_Sales - a.Global_Sales; });
  x.domain(data.map(function(d) { return d.Name; }));
  y.domain([0, d3.max(data, function(d) { return d.Global_Sales; })]).nice();
  //z.domain(keys);

  /*g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Name); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

  /*var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19);
      //.attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d.Name; });

  // Prep the tooltip bits, initial display is hidden
  /*var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
  tooltip.append("rect")
    .attr("width", 60)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 30)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
};


    d3.csv('vgsales.csv')
    .then(function(data) {
      data.forEach(d => {
        d.rank = +d.rank
        d.year = +d.year
        d.NA_Sales = +d.NA_Sales
        d.EU_Sales = +d.EU_Sales
        d.JP_Sales = +d.JP_Sales
        d.Other_Sales = +d.Other_Sales
        d.Global_Sales = +d.Global_Sales
      })
    
      this.dataArray = data
    
      // Calcular la altura más alta dentro de
      // los datos (columna "oficial")
      maxy = d3.max(data, d => d.Global_Sales)
      miny = d3.min(data, d => d.Global_Sales)
      
      // Creamos una función para calcular la altura
      // de las barras y que quepan en nuestro canvas
      y.domain([0, maxy])
    
      // V. Despliegue
      render(dataArray)
    })
    .catch(e => {
      console.log('No se tuvo acceso al archivo ' + e.message)
    })*/