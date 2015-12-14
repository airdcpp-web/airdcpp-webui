var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var proxyMiddleware = require('http-proxy-middleware');


var proxyOptions = {
	onError: function (err, req, res) {
		try {
			res.end(err);
		} catch(e) {
			//res.set("Connection", "close");
			console.log(e);
		}
	}
};

var proxy = proxyMiddleware('ws://localhost', proxyOptions);
//var proxy = proxyMiddleware('ws://192.168.0.200:5480');
var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(proxy);

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/*proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  
  res.end('Something went very wrong.');
});*/

app.listen(3000, '0.0.0.0', function (err) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at http://0.0.0.0:3000');
});
