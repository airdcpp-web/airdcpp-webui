var path = require('path');
var express = require('express');
var httpProxy = require('http-proxy');
var compression = require('compression');
var chalk = require('chalk');

var apiHost = process.argv[2] || 'localhost';
var serverPort = process.argv[3] || 3000;
var apiPort = process.argv[4] || 5600;

// Create server
var app = express();


// Set proxy
var proxy = new httpProxy.createProxyServer({
  target: {
    host: apiHost,
    port: apiPort
  }
});

proxy.on('error', function (err, req, res) {
	try {
		res.end(err);
	} catch(e) { }
});

console.log('');

// Env-specific configuration
if (process.env.NODE_ENV !== 'production') {
	var webpack = require('webpack');
	var config = require('./webpack.config.js');
	
	console.log(chalk.bold('Building webpack...'));
	
	var compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	}));

	app.use(require('webpack-hot-middleware')(compiler));
} else {
	console.log(chalk.bold('Demo mode:', process.env.WEB_DEMO == 1));
	app.use('/', express.static('dist'));
	app.use(compression());
}

app.get("/view/*", function(req, res){ 
  proxy.web(req, res);
});

// Setup static file handling
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen
function listen(bindAddress, protocol) {
	var ret = app.listen(serverPort, bindAddress, function (err) {
		if (err) {
			console.error('Failed to listen on ' + bindAddress + ': ' + err);
			return;
		}
		
		console.log('Listening ' + bindAddress + ':' + serverPort);
	});
	
	ret.on('upgrade', function (req, socket, head) {
		console.log('Upgrade to websocket', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
		proxy.ws(req, socket, head);
	});
	
	return ret;
}

var server4 = listen('0.0.0.0', 'v4');
var server6 = listen('[::]', 'v6');

console.log('API address: ' + apiHost + ':' + apiPort);
console.log('');