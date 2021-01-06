dataArray = []

function render(data){

var x = d3.scalePoint()
          .domain(["A", "B", "C", "D", "E"])         
          .range([100, 700]); 

var svg = d3.select('#graf')
            .append('svg')
            .attr('width', 700)
            .attr('height', 500)

svg
  .append("g")
  .attr("transform", "translate(0,650)")      // This controls the vertical position of the Axis
  .call(d3.axisBottom(x));

svg
  .append("circle")
  .attr("cx", x("B"))
  .attr("cy", 50)
  .attr("r", 8)
}

d3.csv('edificios.csv')
.then(function(data) {
  data.forEach(d => {
    d.oficial = +d.oficial
    d.ano = +d.ano
    d.antena = +d.antena
    d.piso = +d.piso
    d.ultimopiso = +d.ultimopiso
    d.puesto = +d.puesto
    d.edificio = +d.edificio
  })

  this.dataArray = data

  // Calcular la altura más alta dentro de
  // los datos (columna "oficial")
  maxy = d3.max(data, d => d.oficial)

  // Creamos una función para calcular la altura
  // de las barras y que quepan en nuestro canvas
  y.domain([0, maxy])

  // V. Despliegue
  render(dataArray)
})
.catch(e => {
  console.log('No se tuvo acceso al archivo ' + e.message)
})