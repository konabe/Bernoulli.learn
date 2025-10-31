var prior_data;
var posterior_data;
var likelihood_data;
var domain = getDomain();
var alpha = 2;
var beta = 2;
var input_data = [];

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

function getPostParamters(input, prior_alpha, prior_beta){
  var sum  = function(arr) {
    if(arr.length == 0){
      return 0;
    }
    return arr.reduce(function(prev, current, i, arr) {
        return prev+current;
    });
  };
  var sum_input = sum(input);
  return {alpha: sum_input + prior_alpha, beta: input.length - sum_input + prior_beta};
}

function getBeta(x, alpha, beta){
  var betaData = x.map(function(ele, ind, arr){
    return {x: ele, y: beta_pdf_each(ele, alpha, beta)};
  });
  return betaData;
}

function getZeros(x){
  var zeros = x.map(function(ele, ind, arr){
    return {x: ele, y: 0.0};
  });
  return zeros;
}

prior_data = getBeta(domain, alpha, beta);
post_param = getPostParamters(input_data, alpha, beta);
posterior_data = getBeta(domain, post_param.alpha, post_param.beta);
likelihood_data = getZeros(domain);

/* configure of svg element */
var svg = d3.select("svg")
    .attr('width', svgWidth)
    .attr('height', svgHeight);

/* configure of graph area */
var priorG = svg.append('g')
    .attr('transform', translate(margin.left, margin.top));

var postG = svg.append('g')
    .attr('transform', translate(margin.left, margin.top));

var likelihoodG = svg.append('g')
    .attr('transform', translate(margin.left, margin.top));

/* initilaization */

setScale();
initializePlot();
initializeAxis();

svg.on("mousedown", handleMouseDown);
updateAlphaBetaDisplay();
d3.select("body").on("keydown", handleKeyDown);
updateDataDisplay();

/* plot initialize graph */
function initializePlot(){
  priorG.selectAll('circle')
      .data(prior_data)
      .enter()
      .append('circle')
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})
      .attr('r', 3)
      .attr('fill', 'red');

  postG.selectAll('circle')
      .data(posterior_data)
      .enter()
      .append('circle')
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})
      .attr('r', 3)
      .attr('fill', 'blue');

  likelihoodG.selectAll('circle')
      .data(likelihood_data)
      .enter()
      .append('circle')
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})
      .attr('r', 2)
      .attr('fill', 'green');
}

function updatePlot(){
  priorG.selectAll('circle')
      .data(prior_data)
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})

  postG.selectAll('circle')
      .data(posterior_data)
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})

  likelihoodG.selectAll('circle')
      .data(likelihood_data)
      .attr('cx', function(d){return scale.x(d.x)})
      .attr('cy', function(d){return scale.y(d.y)})
}

//TODO alpha, betaの値を表示
function updateAlphaBetaDisplay() {
  d3.select(".alpha").text(alpha.toFixed(2));
  d3.select(".beta").text(beta.toFixed(2));
}

function handleMouseDown(d, i){
  var w = d3.select(this)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);
  d3.event.preventDefault();

  function mousemove(){
    var coords = d3.mouse(this);
    alpha = 10*coords[0]/svgWidth;
    beta = 10*coords[1]/svgHeight;
    prior_data = getBeta(domain, alpha, beta);
    post_param = getPostParamters(input_data, alpha, beta);
    posterior_data = getBeta(getDomain(), post_param.alpha, post_param.beta);
    updatePlot();
    updateAlphaBetaDisplay();
  }

  function mouseup(){
    w.on("mousemove", null).on("mouseup", null);
  }
}

function handleKeyDown(){
  switch (d3.event.keyCode) {
    case 65: //A -> push 0
      if(input_data.length < 100){
        input_data.push(0);
      }
      break;
    case 68: //D -> push 1
      if(input_data.length < 100){
        input_data.push(1);
      }
      break;
    case 83: // S -> pop
      if(input_data.length > 0){
        input_data.pop();
      }
      break;
    case 67: // C -> delete
      input_data = [];
      break;
    default:
      break;
  }
  post_param = getPostParamters(input_data, alpha, beta);
  posterior_data = getBeta(domain, post_param.alpha, post_param.beta);
  if(input_data.length != 0){
    likelihood_data = getBeta(domain, post_param.alpha-alpha+1, post_param.beta-beta+1);
  }else{
    likelihood_data = getZeros(domain);
  }
  updatePlot();
  updateAlphaBetaDisplay();
  updateDataDisplay();
}

function updateDataDisplay(){
  // container for visualizing input_data as colored boxes
  var container = d3.select('#data-strip');

  // bind data
  var items = container.selectAll('.data-item')
      .data(input_data);

  // remove old
  items.exit().remove();

  // add new
  items.enter()
      .append('div')
      .attr('class', 'data-item')
      .style('background', function(d){ return d === 1 ? '#fd8d3c' : '#6baed6'; })
      .attr('title', function(d, i){ return i + ': ' + d; });

  // update existing
  container.selectAll('.data-item')
      .style('background', function(d){ return d === 1 ? '#fd8d3c' : '#6baed6'; })
      .attr('title', function(d, i){ return i + ': ' + d; });

  // update count
  d3.select('#data-count').text(input_data.length);
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
