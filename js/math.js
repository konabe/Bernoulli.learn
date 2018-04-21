function beta_func(x, y){
  return gamma(x)*gamma(y)/gamma(x+y);
}

function beta_pdf_each(x, alpha, beta){
  if(!alpha || !beta || !x){
    return undefined;
  }
  return Math.pow(x, alpha-1)*Math.pow(1-x, beta-1)/beta_func(alpha, beta);
}

function beta_pdf(x, alpha, beta){
  var y = x.map(function(ele){
    return beta_pdf_each(ele, alpha, beta);
  });
  return y;
}
