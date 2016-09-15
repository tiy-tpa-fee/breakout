'use strict'

// NOTE: NOT A PRODUCTION CONFIG
// TODO: MAKE ONE OF THOSE!

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')

const ROOT_PATH = path.resolve(__dirname)
const SOURCE_PATH = path.resolve(ROOT_PATH, 'src')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')

module.exports = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    SOURCE_PATH
  ],
  output: {
    filename: 'bundle.js',
    path: BUILD_PATH,
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(SOURCE_PATH, 'index.html'),
      inject: 'body',
      filename: 'index.html'
    })
  ],
  devServer: {
    colors: true,
    historyApiFallback: true,
    inline: false,
    port: 3000,
    hot: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [SOURCE_PATH],
      loader: 'babel'
    }, {
      test: /\.(sass|scss)$/,
      loaders: ['style', 'css', 'postcss', 'sass']
    }, {
      test: /\.(png|jpe?g|gif|svg|ttf|eot|otf|woff|woff2)$/,
      loader: 'file'
    }]
  },
  postcss: function () {
    return [autoprefixer]
  }
}
