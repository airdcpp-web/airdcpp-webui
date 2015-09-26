var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./src/app.jsx",

  output: {
    path: __dirname + '/build/',
    filename: '[name].entry.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/build/'
  },

  module: {
    loaders: [
      { 
		  test: /\.(js|jsx)$/, 
		  include: /src/, 
		  loader: 'babel'
	  }, {
		  test: /\.css$/,
		  include: /src/, 
		  loader: "style!css" 
	  }
    ]
  },

  node: {
    Buffer: false
  },
  
  resolve: {
	extensions: ['', '.js', '.jsx'],
	root: path.resolve('./src'),
  },

  plugins: [
    //new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
		"window.jQuery": "jquery",
		//Scroller: "zynga/Scroller.js"
	}),
	/*new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	})*/
  ]

};
