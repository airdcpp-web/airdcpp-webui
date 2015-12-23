var path = require('path');
var express = require('express');
var httpProxy = require('http-proxy');
var compression = require('compression');

var apiHost = process.argv[2] || 'localhost';
var port = process.argv[3] || 3000;

// Create server
var app = express();


// Set proxy
var proxy = new httpProxy.createProxyServer({
  target: {
    host: apiHost,
    port: 80
  }
});

proxy.on('error', function (err, req, res) {
	try {
		res.end(err);
	} catch(e) { }
});


// Env-specific configuration
if (process.env.NODE_ENV !== 'production') {
	var webpack = require('webpack');
	var config = require('./webpack.config.js');
	
	var compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	}));

	app.use(require('webpack-hot-middleware')(compiler));
} else {
	app.use('/', express.static('dist'));
	app.use(compression());
}


// Setup static file handling
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});


// Listen
var server = app.listen(port, '0.0.0.0', function (err) {
	console.log('API host: ' + apiHost);
	console.log('Server port: ' + port);
	if (err) {
		console.log(err);
		return;
	}

	
	console.log('Listening for connections');
});

server.on('upgrade', function (req, socket, head) {
  console.log("Upgrade to websocket", req.url);
  proxy.ws(req, socket, head);
});