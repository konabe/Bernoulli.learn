
/* initilaization */

var start = 1;
var end = 999;
var res = 1000;  // resolution of x axis.
var x_graph = [];
for(var i = start; i <= end; i += 1){
  x_graph.push(i/res);
}

/* hyperparameters */

var alpha = 0.5;
var beta = 0.5;


var y_graph = beta_pdf(x_graph, alpha, beta);

console.log(x_graph);
console.log(y_graph);
