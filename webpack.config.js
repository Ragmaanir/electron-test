var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: ".built/main.js",
  },

  resolve: {
    extensions: [".ts", ".js", ".json"],
    modules: [
      path.join(__dirname, './src'),
      path.join(__dirname, './node_modules')
    ]
  },

  //devtool: "source-map",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  }
};
