const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin2');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

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
};

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
];

const releasePlugins = [
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
  }),
  new InjectManifest({
    swSrc: path.join(__dirname, 'src/sw.js'),
    swDest: process.env.SERVICEWORKER,
    include: [
      /\.(js|html)$/,
    ],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Size of the uncompressed entry chunk exceeds the default limit
  })
];

const debugPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin()
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
  devServer: {
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash].entry.js',
    chunkFilename: chunkFilename,
    assetModuleFilename: 'assets/[name].[hash][ext]',
  },
  watchOptions: {
    ignored: /resources\/locales\/[a-z]{2}\/.*\.missing\.json/,
  },

  // cheap-module-source-map doesn't seem to work with Uglify
  devtool: release ? 'source-map' : 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: /src/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              getCustomTransformers: () => ({
                before: !release ? [ReactRefreshTypeScript()] : [],
              }),
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          },
        ],
      }, { 
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
        test: /\.(jpg|png|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024
          }
        }
      }
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
    concatenateModules: true,
  }
};
