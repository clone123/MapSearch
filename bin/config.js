var path = require('path')

var context = path.resolve(__dirname, '../')

module.exports = {
  distPath: path.resolve(context, './public/dist/'),
  srcPath: path.join(context, './client/'),
  publicPath: '/public/dist/',
  port: process.env.PORT || '3100'
}

/**
 * 驼峰
 * @param str
 * @param splitStr
 * @returns {*}
 */
exports.camel = function (str, splitStr) {
  splitStr = splitStr || '.'
  str = '' + str
  return str.split(splitStr).reduce(function (c, a) {
    return c + a[ 0 ].toUpperCase() + a.slice(1, a.length)
  })
}
