var path = require('path');
var express = require('express');
var httpProxy = require('http-proxy');
var compression = require('compression');

var chalk = require('chalk');
var minimist = require('minimist');

var argv = minimist(process.argv.slice(2), {
	default: {
		apiHost: 'localhost:5600',
		bind4: '0.0.0.0',
		port: 3000
	}
});

// Create server
var app = express();


// Set proxy
var proxy = new httpProxy.createProxyServer({
  target: argv.apiHost
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
	app.use('/', express.static(process.env.DEMO_MODE === '1' ? 'demo' : 'dist'));
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
	var ret = app.listen(argv.port, bindAddress, function (err) {
		if (err) {
			console.error('Failed to listen on ' + bindAddress + ': ' + err);
			return;
		}
		
		console.log('Listening ' + bindAddress + ':' + argv.port);
	});
	
	ret.on('upgrade', function (req, socket, head) {
		console.log('Upgrade to websocket', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
		proxy.ws(req, socket, head);
	});
	
	return ret;
}

listen(argv.bind4, 'v4');
//listen('[::]', 'v6');

console.log('API address: ' + argv.apiHost);
console.log('');