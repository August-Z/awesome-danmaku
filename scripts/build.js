const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const config = {
  context: path.resolve(__dirname, '../'),
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: 'danmaku.js',
    path: path.resolve(__dirname, '../') + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

module.exports = config
