'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const autoprefixer = require('autoprefixer')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  entry: [
    utils.resolve('src'),
    utils.resolve('test')
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    hot: false,
    compress: true,
    contentBase: false,
    host: HOST || 'localhost',
    port: PORT || 9090,
    open: false,
    index: 'index.html',
    inline: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    proxy: {},
    quiet: true,
    watchOptions: {
      poll: false
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Awesome Danmaku Dev Runtime',
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
})

module.exports = devWebpackConfig
