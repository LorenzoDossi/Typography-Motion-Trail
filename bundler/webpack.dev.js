const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(commonConfiguration,
  {
    stats: 'errors-warnings',
    mode: 'development',
    watch: true
  }
)
