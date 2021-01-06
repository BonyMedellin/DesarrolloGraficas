// I. Configuración
graf = d3.select('#graf')

ancho_total = graf.style('width').slice(0, -2)
alto_total = ancho_total * 9 / 16

graf.style('width', `${ ancho_total }px`)
    .style('height', `${ alto_total }px`)

margins = { top: 10, left: 15, right: 15, bottom: 100 }
padding = 20
paddingx = 279
ancho = ancho_total - margins.left - margins.right
alto  = alto_total - margins.top - margins.bottom

anchogrid = ancho - margins.right

// II. Variables globales
svg = graf.append('svg')
          .style('width', `${ ancho_total }px`)
          .style('height', `${ alto_total }px`)

//Barras
g = svg.append('g')
        .style('transform', `translate(${ margins.left }px, ${ margins.top }px)`)
        .style('width', ancho + 'px')
        .style('height', alto + 'px')

y = d3.scaleLinear()
          .range([alto, 0])

dataArray = []

// III. render (update o dibujo)
function render(data) {
  
  var myColor = d3.scaleLinear().domain([0, maxy])
        .range(['#BFBFBB', '#0966B3']);

  var yTextPadding = 20;

  svg.append('g');

  var numberOfTicks = 6;
  
  // EJE X

  xScale = d3.scaleBand()
        .range([0, ancho])
        //.rangeRound([margins.left,ancho])
        .padding(0.4)
        ;

  xScale.domain(data.map(function(d){ return d.edificio}));

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

  // EJE Y
  
  y_domain = [maxy, 0];

  yScale = d3.scaleLinear().domain(y_domain).nice()
              .range(['0', alto]);
    
  yAxis = d3.axisLeft(yScale);

  g.append('text')
       .attr('class', 'y label')
       .attr('text-anchor', 'middle')
       .attr('x', -alto/2)
       .attr('y', 1)
       .attr('dy', '.1em')
       .attr('transform', 'rotate(-90)')
       .attr('font-size' , '12px')
       .text('Altura (metros)');

  g.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + 35 + ',0)')
    .call(yAxis);
  
  // GRID EJE Y

  var yAxisGrid = yAxis.ticks(10)
                       .attr('class', 'yGrid')
                       .tickSize(ancho, 0)
                       .tickFormat('');
                       //.orient('right');

  g.append('g')
   .attr('transform', 'translate(' + ancho_total + ',0)')
   .call(yAxisGrid);

  // BARRAS

  bars = g.selectAll('rect')
          .data(data);

  bars.enter()
      .append('rect')
      .style('width', xScale.bandwidth()+4)
      .style('height', d => (alto - yScale(d.oficial)) + 'px')
      .style('x', function(d){return xScale(d.edificio)+20})
      .style('y', d => (yScale(d.oficial))) //modificar alto de barra
      .attr('fill', function(d){return myColor(d.oficial)});
  
       
  // NUMERO DENTRO DE LAS BARRAS

  bars.enter()
      .append('text')
      .text(function(d) { return d.oficial})
      //.attr('transform', 'rotate(90)')
      .attr('x', function(d){return xScale(d.edificio)+20})
      .attr('y', d => (yScale(d.oficial)) + 'px')
      .attr('font-family' , 'sans-serif')
      .attr('font-size' , '7px')
      .attr('fill' , 'white')
      .attr('dy', '09px')
      .attr('text-anchor', 'start');
      
   console.log(alto);
}


// IV. Carga de datos
d3.csv('edificios.csv')
.then(function(data) {
  data.forEach(d => {
    d.oficial = +d.oficial
    d.ano = +d.ano
    d.antena = +d.antena
    d.piso = +d.piso
    d.ultimopiso = +d.ultimopiso
    d.puesto = +d.puesto
  })

  this.dataArray = data

  // Calcular la altura más alta dentro de
  // los datos (columna "oficial")
  maxy = d3.max(data, d => d.oficial)
  miny = d3.min(data, d => d.oficial)
  
  // Creamos una función para calcular la altura
  // de las barras y que quepan en nuestro canvas
  y.domain([0, maxy])

  // V. Despliegue
  render(dataArray)
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})
