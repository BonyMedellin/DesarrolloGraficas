graf = d3.select('#graf')

ancho_total = 900
alto_total = 500

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

margins = { top: 20, left: 30, right: 100, bottom: 50 }
ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom


// II. Variables globales
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)
    //.append("g")
    //.attr("transform", "translate(" + margins.left + "," + margins.top + ")");

g = svg.append('g')
        .style('transform', `translate(${ margins.left }px, ${ margins.top }px)`)
        .style('width', ancho + 'px')
        .style('height', alto + 'px')

y = d3.scaleLinear()
          .range([alto, 0])

dataArray = []

function render(data) {

  //console.log("Data:", data);

  var Countries = [ "North America", "European Union", "Japon", "Other Countries"];

  var myColor =   d3
                  .scaleOrdinal()
                  .range(["#089C8A", "#1D4861", "#70A0AF", "#706993"]);
  
  myColor.domain(Countries);

  console.log();

// EJE X
    xScale = d3.scaleBand()
               .rangeRound([0, ancho])
               .padding(0.2)
               .align(0.2);

    xScale.domain(data.map(function(d){ return d.Name}));

    xAxis = d3.axisBottom(xScale);

    g.append('g')
     .attr('class', 'x axis')
     .attr('transform', 'translate(50,'+ alto+')')
     .call(xAxis)
     .selectAll('text')
     .attr('dx', '09px')
     .attr('text-anchor', 'middle')
     ;
    
    //console.log(d.Platform)

// EJE Y
  
  y_domain = [maxy, 0];

  yScale = d3.scaleLinear().domain(y_domain).nice()
              .range(['0', alto]);
    
  yAxis = d3.axisLeft(yScale)
  .ticks(10);

  g.append('text')
       .attr('class', 'y label')
       .attr('x', -alto/2)
       .attr('y', 1)
       .attr('dy', '.1em')
       .attr('transform', 'rotate(-90)')
       .text('Value (millions)');

  g.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + 50 + ',0)')
    .call(yAxis);

// LEYENDAS

var legend = g.append("g")
      .attr('class', 'legend')
      .selectAll("g")
      .data(Countries.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(50," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", ancho - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", myColor);

  legend.append("text")
      .attr("x", ancho - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

// TOOLTIP

var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .attr("opacity", 0);

// BARRAS

  bars = g.selectAll('rect')
          .data(data);

  bars
    .enter()
      .append('rect')
      .style('width', xScale.bandwidth())
      .style('height', d => (alto - yScale(d.Value)) + 'px')
      .style('x', function(d){return xScale(d.Name)+52})
      .style('y', d => (yScale(d.Value)) + 'px')
      .attr('fill', function(d){return myColor(d.Countries)})
      .on("mouseover", function(event,d) {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html("Countrie: " + d.Countries + "<br/>" + "Value: " + d.Value + " millions")
            .style("left", (event.pageX+2) + "px")
            .style("top", (event.pageY) + "px");
          })
      .on("mouseout", function(d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
          });

        
}

// CARGA BASE DE DATOS

d3.csv('vgsales.csv')
    .then(function(data) {
      data.forEach(d => {
        d.Value = +d.Value
      })
    
      this.dataArray = data

      maxy = d3.max(data, d => d.Value)-95

      total = d3.sum(data, d => d.Value)
    
      render(dataArray)
    })
    .catch(e => {
      console.log('No se tuvo acceso al archivo ' + e.message)
    })