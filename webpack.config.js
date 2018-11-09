const webpack = require('webpack');

module.exports = {
  entry: {
    'app.bundle': ['./js/app.js'],
    'service_worker': ['./sv.js']
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  watch: true,
  devtool: 'eval-source-map'
};