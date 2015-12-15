var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var proxyMiddleware = require('http-proxy-middleware');
var compression = require('compression');

var apiHost = process.argv[2] || 'localhost';
var port = process.argv[3] || 3000;


var proxyOptions = {
	onError: function (err, req, res) {
		try {
			res.end(err);
		} catch(e) { }
	}
};

var proxy = proxyMiddleware('ws://' + apiHost, proxyOptions);
var app = express();
var compiler = webpack(config);

if (process.env.NODE_ENV !== 'production') {
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	}));

	app.use(require('webpack-hot-middleware')(compiler));
} else {
	app.use(compression());
}

app.use(proxy);;

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', function (err) {
	console.log('API host: ' + apiHost);
	console.log('Server port: ' + port);
	if (err) {
		console.log(err);
		return;
	}

	
	console.log('Listening for connections');
});
