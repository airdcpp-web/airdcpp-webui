var path = require('path');
var webpack = require('webpack');

const release = (process.env.NODE_ENV === 'production');

var plugins = [
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
		"window.jQuery": "jquery",
	}),
];

var releasePlugin = [
  new webpack.DefinePlugin({
    "process.env": {
      "NODE_ENV": JSON.stringify("production"),
    },
  }),
  
  new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
  }),
  
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
]

if (release)  {
  plugins = plugins.concat(releasePlugins);
}

module.exports = {
  entry: "./src/app.jsx",

  output: {
    path: __dirname + '/build/',
    filename: '[name].entry.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/build/'
  },

  devtool: !release && "inline-source-map",
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
		  test: /\.jpg$/, 
		  loader: 'file-loader'
	  }, {
		  test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
		  include: [
		    path.resolve(__dirname, "src"),
		    path.resolve(__dirname, "node_modules/semantic-ui/dist")
		  ],
		  loader: 'url-loader?limit=100000'
	  },
    ]
  },

  node: {
    Buffer: false
  },
  
  resolve: {
	extensions: ['', '.js', '.jsx'],
	root: path.resolve('./src'),
	alias: {
		'semantic-ui' : path.join(__dirname, 'node_modules/semantic-ui/dist')
	}
  },

  plugins: plugins
};
