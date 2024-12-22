const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const chalk = require('chalk');
const minimist = require('minimist');

const i18next = require('i18next');
const FsBackend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('../webpack.config.js');
const publicPath = config.output.publicPath || '/';

i18next.use(FsBackend).init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en'],
  ns: ['main'],
  saveMissing: true,
  //debug: true,
  backend: {
    loadPath: 'resources/locales/{{lng}}/webui.{{ns}}.json',
    addPath: 'resources/locales/{{lng}}/webui.{{ns}}.missing.json',
  },
});

const argv = minimist(process.argv.slice(2), {
  default: {
    apiSecure: false,
    apiHost: 'localhost:5600',
    bindAddress: '0.0.0.0',
    port: 3000,
  },
});

if (process.env.NODE_ENV === 'production') {
  console.error('This server is not supported in production environment');
  process.exit(1);
}

const targetUrl = (argv.apiSecure ? 'https://' : 'http://') + argv.apiHost;

// Create server
const app = express();

// Set proxy
const simpleRequestLogger = (proxyServer, options) => {
  proxyServer.on('proxyReq', (proxyReq, req, res) => {
    console.log(`[HPM] [${req.method}] ${req.url}`); // outputs: [HPM] GET /users
  });
};

const prefixPath = (path) => {
  return publicPath + path;
};

const proxyMiddleware = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  pathFilter: [
    prefixPath('api'),
    prefixPath('view'),
    prefixPath('temp'),
    prefixPath('js/locales'),
    prefixPath('proxy'),
  ],
  pathRewrite: (path, req) => {
    return path.replace(publicPath, '/');
  },
  on: {
    error: (err, req, res) => {
      try {
        res.end(err);
      } catch (e) {
        //
      }
    },
  },
  plugins: [simpleRequestLogger],
});

app.use(proxyMiddleware);

console.log('');

// Set up Webpack
const webpack = require('webpack');

console.log(chalk.bold('Building webpack...'));

const compiler = webpack(Object.assign(config, { mode: 'development' }));
app.use(
  require('webpack-dev-middleware')(compiler, {
    publicPath,
  }),
);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(i18nextMiddleware.handle(i18next));

app.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18next));

const localizationMiddleware = (req, res, next) => {
  // Can be used for testing custom translation files
  const filename = path.join(
    compiler.context,
    'resources',
    req.baseUrl.replace('/js', ''),
  );
  fs.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }

    res.set('content-type', 'application/json');
    res.send(result);
    res.end();
    return undefined;
  });
};

// Setup static file handling
// https://github.com/ampedandwired/html-webpack-plugin/issues/145#issuecomment-170554832
app.use('*', (req, res, next) => {
  if (req.baseUrl.startsWith('/js/locales')) {
    return localizationMiddleware(req, res, next);
  }

  const filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }

    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
    return undefined;
  });
});

// Listen
const server = app.listen(argv.port, argv.bindAddress, (err) => {
  const { address, port } = server.address();
  const fullAddress = `${address}:${port}`;
  if (err) {
    console.error(`Failed to listen on ${fullAddress}: ${err}`);
    return;
  }

  console.log(`Listening ${fullAddress}`);
});

server.on('upgrade', proxyMiddleware.upgrade); // Websockets

console.log(`API address: ${targetUrl}`);
console.log('');
