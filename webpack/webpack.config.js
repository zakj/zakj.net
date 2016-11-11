var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'flex': './flex',
    'ladder': './ladder',
    'nato': './nato',
    'styles': './sass/main.sass',
    'vendor': ['gsap', 'maquette', 'vue'],
  },

  output: {
    path: path.join(path.dirname(__dirname), '/assets/gen'),
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel',
      },
      {
        test: /\.sass$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: ExtractTextPlugin.extract('style', 'css!sass'),
      },
      {
        test: /\.vue$/,
        loader: 'vue',
      },
    ],
  },

  preLoaders: [
    {
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: path.resolve(__dirname, 'node_modules'),
    },
  ],

  plugins: [
    new HtmlWebpackPlugin(),
    new ExtractTextPlugin('[name].css', {
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity,
    }),
  ],

  devtool: 'source-map',
};
