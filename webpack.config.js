var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");

const release = (process.env.NODE_ENV === 'production');
const demo = (process.env.DEMO_MODE === '1');
const chalk = require('chalk');


// PLUGINS
var plugins = [
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
];

var releasePlugins = [	
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}),
	
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.optimize.DedupePlugin(),
	
	new CompressionPlugin({
		asset: "{file}.gz",
		algorithm: "gzip",
		regExp: /\.js$/,
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

module.exports = {
	entry: entries,

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].entry.js',
		chunkFilename: 'js/[name].chunk.js',
		publicPath: '/',
	},

	// cheap-module-source-map doesn't seem to work with Uglify
	devtool: release ? '#module-source-map' : '#cheap-module-source-map',
	module: {
		loaders: [
			{ 
				test: /\.(js|jsx)$/, 
				include: /src/, 
				loader: 'babel' 
			}, { 
				test: /\.css$/, 
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/semantic-ui/dist'),
					path.resolve(__dirname, 'node_modules/react-select/dist'),
					path.resolve(__dirname, 'node_modules/fixed-data-table/dist') 
				], 
				loader: 'style-loader!css-loader' 
			}, { 
				test: /\.(jpg|png)$/, 
				loader: 'file-loader?name=images/[name].[ext]' 
			}, { 
				test: /\.(woff|woff2|eot|ttf|svg)$/, 
				include: [
					path.resolve(__dirname, 'src'),
					path.resolve(__dirname, 'node_modules/semantic-ui/dist') 
				], 
				loader: 'url-loader?limit=100000&name=assets/[hash].[ext]' // No name for URLs
			},
		]
	},
	
	resolve: {
		extensions: [ '', '.js', '.jsx' ],
		root: path.resolve('./src'),
		alias: {
			'semantic-ui' : path.join(__dirname, 'node_modules/semantic-ui/dist')
		}
	},

	plugins: plugins
};
