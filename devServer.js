var path = require('path');
var proxyMiddleware = require('http-proxy-middleware');
var express = require('express');
var webpack = require('webpack');

var config = require('./webpack.config');
var compiler = webpack(config);


//var proxy = proxyMiddleware('/api', {target:'http://localhost', ws: true});
var proxy = proxyMiddleware('ws://localhost');

var app = express();
app.use(proxy);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: __dirname
}));

app.use(require('webpack-hot-middleware')(compiler));

/*app.get('*', function(req, res) {
  console.log("Requesting " + req.url);
  var file;
  if (req.url.indexOf('/build') != 0) {
  	file = 'index.html';
  } else {
  	file = req.url;
  }

  res.sendFile(path.join(__dirname, file));
});*/

// serve static assets normally
app.use(express.static(__dirname))

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', function(request, response){
  response.sendFile(path.resolve(__dirname, 'index.html'))
})


app.listen(3000, '0.0.0.0', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});