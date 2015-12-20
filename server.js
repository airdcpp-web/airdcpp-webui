var path = require('path');
var express = require('express');
var proxyMiddleware = require('http-proxy-middleware');
var compression = require('compression');

var apiHost = process.argv[2] || 'localhost';
var port = process.argv[3] || 3000;

// Create server
var app = express();


// Set proxy
var proxyOptions = {
	onError: function (err, req, res) {
		try {
			res.end(err);
		} catch(e) { }
	},
	
	//onProxyReq: function (proxyReq, req, res) {
	//	console.log(proxyReq);
	//}
};

var proxy = proxyMiddleware('ws://' + apiHost, proxyOptions);
app.use(proxy);


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
app.listen(port, '0.0.0.0', function (err) {
	console.log('API host: ' + apiHost);
	console.log('Server port: ' + port);
	if (err) {
		console.log(err);
		return;
	}

	
	console.log('Listening for connections');
});
