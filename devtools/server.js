const path = require('path');
const express = require('express');
const httpProxy = require('http-proxy');

const chalk = require('chalk');
const minimist  = require('minimist');

const i18next = require('i18next');
const FsBackend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');
const bodyParser = require('body-parser');


i18next
  .use(FsBackend)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    preload: [ 'en' ],
    //defaultNS: 'main',
    ns: [ 'main' ],
    saveMissing: true,
    //debug: true,
    backend: {
      loadPath: 'resources/locales/{{lng}}/webui.{{ns}}.json',
      addPath: 'resources/locales/{{lng}}/webui.{{ns}}.missing.json'
    },
    //nsSeparator: '#||#',
    //keySeparator: '#|#'
  });

const argv = minimist(process.argv.slice(2), {
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
const app = express();


// Set proxy
const proxy = new httpProxy.createProxyServer({
  target: (argv.apiSecure ? 'https://' : 'http://') + argv.apiHost
});

proxy.on('error', (err, req, res) => {
  try {
    res.end(err);
  } catch (e) { 
    //
  }
});

console.log('');

// Proxying of viewed files must be defined before the generic static file handling
app.get('/view/*', (req, res) => {
  proxy.web(req, res);
});

app.post('/temp', (req, res) => {
  proxy.web(req, res);
});

app.get('/proxy', (req, res) => {
  proxy.web(req, res);
});

// Set up Webpack
const webpack = require('webpack');
const config = require('../webpack.config.js');

console.log(chalk.bold('Building webpack...'));

const compiler = webpack(Object.assign(config, { mode: 'development' }));
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(i18nextMiddleware.handle(i18next, {
  // ignoreRoutes: ["/foo"],
  // removeLngFromUrl: false
}));

//app.use('/locales', express.static('locales'));

app.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18next));
//app.post('/locales/add/:lng/:ns', (req, res) => {
//  console.warn(req.query, req.body)
//});

// Setup static file handling
// https://github.com/ampedandwired/html-webpack-plugin/issues/145#issuecomment-170554832
app.use('*', (req, res, next) => {
  const filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }
    
    res.set('content-type','text/html');
    res.send(result);
    res.end();
    return undefined;
  });
});

// Listen
const listener = app.listen(argv.port, argv.bindAddress, err => {
  const { address, port } = listener.address();
  const fullAddress = `${address}:${port}`;
  if (err) {
    console.error(`Failed to listen on ${fullAddress}: ${err}`);
    return;
  }
  
  console.log(`Listening ${fullAddress}`);
});

listener.on('upgrade', (req, socket, head) => {
  console.log('Upgrade to websocket', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  proxy.ws(req, socket, head);
});

console.log(`API address: ${proxy.options.target}`);
console.log('');