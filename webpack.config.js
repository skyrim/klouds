const fs = require('fs')
const path = require('path')
const dts = require('dts-bundle')
const ATL = require('awesome-typescript-loader')
const webpack = require('webpack')

const package = JSON.parse(fs.readFileSync('package.json').toString())

const outDir = 'lib'

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
  compiler.hooks.afterEmit.tap('webpack-dts-bundle', () => {
    dts.bundle({
      name: package.name,
      main: path.resolve(__dirname, `${outDir}/index.d.ts`),
      out: path.resolve(__dirname, `${outDir}/klouds.d.ts`),
      removeSource: true,
      outputAsModuleFolder: true,
      verbose: false
    })
  })
}

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
    path: path.resolve(__dirname, outDir),
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
        use: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  plugins: [
    new ATL.CheckerPlugin(),
    new DtsBundlePlugin(),
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
