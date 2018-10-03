'use strict'
const utils = require('./utils')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const prodWebpackConfig = merge(baseWebpackConfig, {
  entry: {
    main: utils.resolve('src')
  }
})

module.exports = prodWebpackConfig
