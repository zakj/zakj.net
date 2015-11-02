var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: '.',
  output: {
    path: 'public',
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css')
    }, {
      test: /\.sass$/,
      loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass')
    }],
  },
  sassLoader: {
    indentedSyntax: true,
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ],
};
