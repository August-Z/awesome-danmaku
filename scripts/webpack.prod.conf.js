'use strict'
const utils = require('./utils')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const prodWebpackConfig = merge(baseWebpackConfig, {
  entry: {
    common: utils.resolve('src/runtime/common.js'),
    esm: utils.resolve('src/runtime/esm.js'),
    browser: utils.resolve('src/runtime/browser.js')
  },
  output: {
    path: utils.resolve('dist'),
    filename: 'danmaku.[name].js',
    libraryTarget: 'umd',
    publicPath: '/'
  },
})

module.exports = prodWebpackConfig
