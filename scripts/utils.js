const path = require('path')

const utils = {
  resolve: (dir) => path.join(__dirname, '..', dir),
  cssLoaders: () => {
    // todo includes scss less and stylus loader default config !!
  }
}

module.exports = utils
