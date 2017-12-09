var path = require('path');
var express = require('express');
var httpProxy = require('http-proxy');

var chalk = require('chalk');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
	default: {
		apiSecure: false,
		apiHost: 'localhost:5600',
		bindAddress: '0.0.0.0',
		port: 3000
	}
});


if (process.env.NODE_ENV === 'production') {
	console.error('This server is not supported in production environment');
	return;
}


// Create server
var app = express();


// Set proxy
var proxy = new httpProxy.createProxyServer({
  target: (argv.apiSecure ? 'https://' : 'http://') + argv.apiHost
});

proxy.on('error', function (err, req, res) {
	try {
		res.end(err);
	} catch(e) { }
});

console.log('');

// Proxying of viewed files must be defined before the generic static file handling
app.get("/view/*", function(req, res){
	proxy.web(req, res);
});

// Set up Webpack
var webpack = require('webpack');
var config = require('./webpack.config.js');

console.log(chalk.bold('Building webpack...'));

var compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
	hot: true,
	historyApiFallback: true,
	noInfo: true,
	publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

// Setup static file handling
// https://github.com/ampedandwired/html-webpack-plugin/issues/145#issuecomment-170554832
app.use('*', function (req, res, next) {
	var filename = path.join(compiler.outputPath, 'index.html');
	compiler.outputFileSystem.readFile(filename, function(err, result){
		if (err) {
			return next(err);
		}
		res.set('content-type','text/html');
		res.send(result);
		res.end();
	});
});

// Listen
var listener = app.listen(argv.port, argv.bindAddress, function (err) {
	var fullAddress = listener.address().address + ':' + listener.address().port;
	if (err) {
		console.error('Failed to listen on ' + fullAddress + ': ' + err);
		return;
	}
	
	console.log('Listening ' + fullAddress);
});

listener.on('upgrade', function (req, socket, head) {
	console.log('Upgrade to websocket', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	proxy.ws(req, socket, head);
});

console.log('API address: ' + proxy.options.target);
console.log('');