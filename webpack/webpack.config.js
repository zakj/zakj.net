var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: {
    'styles': './sass/main.sass',
  },
  module: {
    loaders: [
      {
        test: /\.sass$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: ExtractTextPlugin.extract('style', 'css!sass'),
      },
    ],
  },
  output: {
    path: path.join(path.dirname(__dirname), '/assets/gen'),
    filename: '[name].js',
  },
  plugins: [
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
