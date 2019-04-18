'use strict'
const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.conf')

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    common: './src/runtime/common.js',
    esm: './src/runtime/esm.js',
    browser: './src/runtime/browser.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'danmaku.[name].js',
    libraryTarget: 'umd',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
  ]
})

module.exports = prodWebpackConfig
