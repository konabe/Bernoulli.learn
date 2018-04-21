var prior_data;
var domain = getDomain();

var input_data = [1, 0, 0, 1, 0];

/* d3.js setting */
svgWidth = 800;
svgHeight = 600;
var margin = {top: 20, right: 20, bottom: 20, left: 40};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var scale = {};

/* prior distribution */
function getDomain(){
  var start = 1;
  var end = 99;
  var res = 100;  // resolution of x axis.
  var x_graph = [];
  for(var i = start; i <= end; i += 1){
    x_graph.push(i/res);
  }
  return x_graph;
}

function getPostParamters(){

}

function getBeta(x, alpha, beta){
  var betaData = x.map(function(ele, ind, arr){
    return {x: ele, y: beta_pdf_each(ele, alpha, beta)};
  });
  return betaData;
}

prior_data = getBeta(getDomain(), 2, 2);

/* configure of svg element */
var svg = d3.select("svg")
    .attr('width', svgWidth)
    .attr('height', svgHeight);

/* configure of graph area */
var priorG = svg.append('g')
    .attr('transform', translate(margin.left, margin.top));

var postG = svg.append('g')
    .attr('transform', translate(margin.left, margin.top));

/* initilaization */

setScale();
initializePlot();
initializeAxis();

svg.on("mousedown", handleMouseDown);


/* plot initialize graph */
function initializePlot(){
  priorG.selectAll('circle')
      .data(prior_data)
      .enter()
      .append('circle')
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})
      .attr('r', 3);
}

function updatePlot(newData){
  priorG.selectAll('circle')
      .data(newData)
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})
      .attr('r', 3);
}

//TODO alpha, betaの値を表示
function handleMouseDown(d, i){
  var div_alpha = d3.select(".alpha");
  var div_beta = d3.select(".beta");
  var w = d3.select(this)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);
  d3.event.preventDefault();

  function mousemove(){
    var coords = d3.mouse(this);
    var newAlpha = 10*coords[0]/svgWidth;
    var newBeta = 10*coords[1]/svgHeight;
    var newData = getBeta(domain, newAlpha, newBeta);
    div_alpha.text(newAlpha);
    div_beta.text(newBeta);
    updatePlot(newData);
  }

  function mouseup(){
    w.on("mousemove", null).on("mouseup", null);
  }
}

function setScale(){
  var xRangeMin = 0.;
  var xRangeMax = 1.;
  scale.x = d3.scaleLinear()
      .domain([xRangeMin, xRangeMax])
      .range([0, width]);

  var yRangeMin = 0.;
  var yRangeMax = 5.;
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
