const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const package = JSON.parse(fs.readFileSync('package.json').toString())

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: isProd
    ? {
        'klouds.min': path.resolve(__dirname, 'src/index.ts')
      }
    : {
        klouds: path.resolve(__dirname, 'src/index.ts')
      },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
    library: 'klouds',
    libraryTarget: 'umd'
  },
  devtool: isProd ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.(vert|frag)$/,
        use: 'raw-loader'
      },
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: path.resolve(__dirname, 'node_modules'),
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      PACKAGE_VERSION: JSON.stringify(package.version)
    })
  ],
  devServer: {
    compress: true,
    port: 3337,
    inline: false,
    open: true,
    watchContentBase: true
  }
}
