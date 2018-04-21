
/* generation of data */
var start = 1;
var end = 99;
var res = 100;  // resolution of x axis.
var x_graph = [];
for(var i = start; i <= end; i += 1){
  x_graph.push(i/res);
}

/* d3.js setting */
svgWidth = 800;
svgHeight = 600;
var margin = {top: 20, right: 20, bottom: 20, left: 40};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var scale = {};

/* prior distribution */
var alpha = 6;
var beta = 3;
var prior_y = beta_pdf(x_graph, alpha, beta);
var prior_data = x_graph.map(function(ele, ind, arr){
  prior_ele = {x: ele, y: prior_y[ind]};
  return prior_ele;
});

/* configure of svg element */
var svg = d3.select("svg")
    .attr('width', svgWidth)
    .attr('height', svgHeight);

/* configure of graph area */
var g = svg.append('g')
    .attr('transform', translate(margin.left, margin.top));

/* initilaization */
setScale();
initializePlot();
initializeAxis();

/* plot initialize graph */
function initializePlot(){
  var plot = g.selectAll('circle')
      .data(prior_data)
      .enter()
      .append('circle')
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})
      .attr('r', 3);
}

function setScale(){
  var xRangeMin = 0.;
  var xRangeMax = 1.;
  scale.x = d3.scaleLinear()
      .domain([xRangeMin, xRangeMax])
      .range([0, width]);

  var yRangeMin = 0.;
  var yRangeMax = 10.;
  scale.y = d3.scaleLinear()
      .domain([yRangeMin, yRangeMax])
      .range([height, 0]);

}

/* initialzie configure of axis */
function initializeAxis(){
  svg.append('g')
      .attr('class', 'x_axis')
      .attr('transform', translate(margin.left, height + margin.top))
      .call(d3.axisBottom(scale.x));

  svg.append('g')
      .attr('class', "y_axis")
      .attr('transform', translate(margin.left, margin.top))
      .call(d3.axisLeft(scale.y));
}

function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}
