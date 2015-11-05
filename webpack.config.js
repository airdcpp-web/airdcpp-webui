var path = require('path');
var webpack = require('webpack');

const release = (process.env.NODE_ENV === 'production');


// PLUGINS
var plugins = [
	new webpack.optimize.CommonsChunkPlugin({
		minChunks: 3,
		children: true,
	}),
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
		"window.jQuery": "jquery",
	}),
];

var releasePlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  
  new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
  }),
  
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
]

var debugPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]

plugins = plugins.concat(release ? releasePlugins : debugPlugins);

// ENTRY
var entries = [ './src/app.jsx' ]; 
if (!release) {
	entries.push('webpack-hot-middleware/client');
}

console.log("[webpack] Release: " + release);

module.exports = {
  entry: entries,

  output: {
    path: path.resolve(__dirname, "build"),
    filename: '[name].entry.js',
    chunkFilename: '[name].chunk.js',
    publicPath: "/build/",
  },

  devtool: !release && "cheap-module-source-map",
  module: {
    loaders: [
      { 
		  test: /\.(js|jsx)$/, 
		  include: /src/, 
		  loader: 'babel'
	  }, {
		  test: /\.css$/,
		  include: [
		    path.resolve(__dirname, "src"),
		    path.resolve(__dirname, "node_modules/semantic-ui/dist"),
			path.resolve(__dirname, "node_modules/fixed-data-table/dist")
		  ],
		  loader: 'style-loader!css-loader' 
	  }, {
		  test: /\.(jpg|png)$/, 
		  loader: 'file-loader'
	  }, {
		  test: /\.(woff|woff2|eot|ttf|svg)$/, 
		  include: [
		    path.resolve(__dirname, "src"),
		    path.resolve(__dirname, "node_modules/semantic-ui/dist")
		  ],
		  loader: 'url-loader?limit=100000'
	  },
    ]
  },

  /*node: {
    Buffer: false
  },*/
  
  resolve: {
	extensions: ['', '.js', '.jsx'],
	root: path.resolve('./src'),
	alias: {
		'semantic-ui' : path.join(__dirname, 'node_modules/semantic-ui/dist')
	}
  },

  plugins: plugins
};
