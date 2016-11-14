var path = require('path');
var webpack = require('webpack');

var CompressionPlugin = require("compression-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack doesn't set the ENV, which causes issues with some plugins: https://github.com/webpack/webpack/issues/2537
if (process.argv.indexOf('-p') !== -1 && !process.env.NODE_ENV) {
	process.env.NODE_ENV = 'production';
}

const release = (process.env.NODE_ENV === 'production');
const demo = (process.env.DEMO_MODE === '1');
const chalk = require('chalk');


// PLUGINS
var plugins = [
	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Those are about 40 kilobytes
	new webpack.optimize.CommonsChunkPlugin({
		minChunks: 3,
		children: true,
	}),
	new webpack.ProvidePlugin({
		$: 'jquery',
		jQuery: 'jquery',
		'window.jQuery': 'jquery',
	}),
	
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
		'process.env.DEMO_MODE': JSON.stringify(process.env.DEMO_MODE),
		'UI_VERSION': JSON.stringify(require("./package.json").version),
		'UI_BUILD_DATE': JSON.stringify((new Date).getTime()),
	}),
	
	new HtmlWebpackPlugin({
		template: 'resources/index.ejs',
		favicon: 'resources/favicon.ico',
		inject: false
	})
];

var releasePlugins = [
	new webpack.optimize.UglifyJsPlugin({
		sourceMap: true
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: true,
		debug: false
	}),
	new webpack.optimize.DedupePlugin(),
	new CompressionPlugin({
		asset: "[file].gz",
		algorithm: "zopfli",
		test: /\.js$/,
		threshold: 0,
		minRatio: 0
	}),
];

var debugPlugins = [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin()
];

plugins = plugins.concat(release ? releasePlugins : debugPlugins);

// ENTRY
var entries = [ './src/app.jsx' ]; 
if (!release) {
	entries.push('webpack-hot-middleware/client');
}

console.log(chalk.bold('[webpack] Release: ' + release));
console.log(chalk.bold('[webpack] Demo mode: ' + demo));

var chunkFilename = release ? 'js/[name].[chunkhash].chunk.js' : 'js/[name].chunk.js';

module.exports = {
	entry: entries,

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
				test: /\.(js|jsx)$/, 
				include: /src/, 
				use: 'babel-loader' 
			}, { 
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			}, { 
				test: /\.(jpg|png)$/,
				use: [
					{
						loader: "file-loader",
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
						loader: "url-loader",
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
		extensions: [ '.js', '.jsx' ],
		enforceExtension: false,
		alias: {
			'semantic-ui' : path.join(__dirname, 'node_modules/semantic-ui-css')
		}
	},

	plugins: plugins
};
