const path = require('path');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


// Webpack doesn't set the ENV, which causes issues with some plugins: https://github.com/webpack/webpack/issues/2537
if (process.argv.indexOf('-p') !== -1 && !process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
} else if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const release = (process.env.NODE_ENV === 'production');
const demo = (process.env.DEMO_MODE === '1');
const chalk = require('chalk');


// PLUGINS
let plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Those are about 40 kilobytes
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
  }),
  
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.DEMO_MODE': JSON.stringify(process.env.DEMO_MODE),
    'UI_VERSION': JSON.stringify(require('./package.json').version),
    'UI_BUILD_DATE': JSON.stringify((new Date).getTime()),
  }),
  
  new HtmlWebpackPlugin({
    template: 'resources/index.ejs',
    favicon: 'resources/favicon.ico',
    inject: false,
    googleAnalytics: demo,
    chunksSortMode: 'none',
  }),
  new ForkTsCheckerWebpackPlugin({
    async: false,
    memoryLimit: 4096,
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
  new webpack.HotModuleReplacementPlugin()
];

plugins = plugins.concat(release ? releasePlugins : debugPlugins);

// ENTRY
const mainEntries = [];
if (!release) {
  mainEntries.push('webpack-hot-middleware/client?reload=true');
  mainEntries.push('react-hot-loader/patch');
}
mainEntries.push('./src/index.jsx'); 

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
      { 
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }, { 
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 100000,
              name: 'images/[name].[hash].[ext]',
            },
          }
        ]
      }, { 
        test: /\.(woff|woff2|eot|ttf|svg)$/, 
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/semantic-ui-css') 
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
  }
};
