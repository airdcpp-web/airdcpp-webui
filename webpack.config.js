const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');


// Webpack doesn't set the ENV, which causes issues with some plugins: https://github.com/webpack/webpack/issues/2537
if (process.argv.indexOf('-p') !== -1 && !process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
} else if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Service worker must be in the root because of scopes
process.env.SERVICEWORKER = 'sw.js';

const release = (process.env.NODE_ENV === 'production');
const demo = (process.env.DEMO_MODE === '1');
const chalk = require('chalk');


const parseLocaleRegex = () => {
  const locales = fs.readdirSync(path.join(__dirname, 'resources/locales'))
    .filter(f => !f.endsWith('.js'))
    .map(loc => `${loc}$`);

  const ret = `${locales.join('|')}`;
  return new RegExp(ret);
}

// PLUGINS
let plugins = [
  //new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Those are about 40 kilobytes
  new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, parseLocaleRegex()),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  }),
  
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.DEMO_MODE': JSON.stringify(process.env.DEMO_MODE),
    'process.env.SERVICEWORKER': JSON.stringify(process.env.SERVICEWORKER),
    'UI_VERSION': JSON.stringify(require('./package.json').version),
    'UI_BUILD_DATE': JSON.stringify((new Date).getTime()),
  }),
  
  new HtmlWebpackPlugin({
    template: 'resources/index.ejs',
    inject: false,
    googleAnalytics: demo,
    chunksSortMode: 'none',
  }),
  new ForkTsCheckerWebpackPlugin(),
  new ServiceWorkerWebpackPlugin({
    entry: path.join(__dirname, 'src/sw.js'),
    filename: process.env.SERVICEWORKER,
    includes: [ 
      '**/*.js', 
      '**/*.html' 
    ],
  }),
];

const releasePlugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new CompressionPlugin({
    filename: '[file].gz',
    test: /\.js$/,
    threshold: 0,
    minRatio: 1,
    compressionOptions: {
      numiterations: 15
    },
    algorithm(input, compressionOptions, callback) {
      return zopfli.gzip(input, compressionOptions, callback);
    }
  }),
  new Visualizer({
    filename: '../stats.html'
  })
];

const debugPlugins = [
  //new webpack.HotModuleReplacementPlugin()
];

plugins = plugins.concat(release ? releasePlugins : debugPlugins);

// ENTRY
const mainEntries = [];
if (!release) {
  //mainEntries.push('webpack-hot-middleware/client?reload=true');
  //mainEntries.push('react-hot-loader/patch');
}
mainEntries.push('./src/index.tsx'); 

console.log(chalk.bold('[webpack] Release: ' + release));
console.log(chalk.bold('[webpack] Demo mode: ' + demo));

const chunkFilename = release ? 'js/[name].[chunkhash].chunk.js' : 'js/[name].chunk.js';

module.exports = {
  entry: {
    main: mainEntries
  },
  performance: { // The following asset(s) exceed the recommended size limit (250 kB)
    hints: false 
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].entry.js',
    chunkFilename: chunkFilename,
  },

  // cheap-module-source-map doesn't seem to work with Uglify
  devtool: release ? 'module-source-map' : 'module-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: /src/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          },
        ],
      },
      /*{ 
        test: /\.(js|jsx|tsx|ts)$/, 
        include: /src/, 
        use: 'babel-loader' 
      },*/ 
      /*{
        test: /locales/,
        loader: '@alienfast/i18next-loader',
        // options here
        //query: { overrides: [ '../node_modules/lib/locales' ] }
      },*/ { 
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }, {
        test: /webui\.main\.json$/,
        use: [
          {
            // Use a modified bundle-loader until the following issues have been solved:
            // https://github.com/webpack-contrib/bundle-loader/issues/45
            // https://github.com/webpack-contrib/bundle-loader/issues/74
            // 
            //loader: 'bundle-loader',
            loader: path.resolve('webpack/bundle-loader.js'),
            options: {
              name: (resourcePath) => {
                const match = resourcePath.match(/locales[\\\/](.*)[\\\/]webui/);
                const languageCode = match[1];
                return `locales/${languageCode}`;
              }
            },
          }
        ]
      }, { 
        test: /\.(jpg|png|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 100000,
              name: 'images/[name].[hash].[ext]',
              esModule: false
            },
          }
        ]
      }, { 
        test: /\.(woff|woff2|eot|ttf|svg)$/, 
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/fomantic-ui-css') 
        ], 
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: 'assets/[hash].[ext]'
            }
          }
        ]
      },
    ]
  },
  
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./resources'),
      'node_modules'
    ],
    extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
    enforceExtension: false
  },

  plugins: plugins,
  optimization: {
    splitChunks: !release ? false : {
      minChunks: 3,
      cacheGroups: {
        vendors: false
      }
    },
    minimize: release,
  },
  watchOptions: {
    ignored: /locales/
  }
};
