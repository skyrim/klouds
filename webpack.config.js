const fs = require('fs')
const path = require('path')
const dts = require('dts-bundle')
const ATL = require('awesome-typescript-loader')

const package = JSON.parse(fs.readFileSync('package.json').toString())

const outDir = 'lib'

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
  compiler.hooks.afterEmit.tap('webpack-dts-bundle', () => {
    dts.bundle({
      name: package.name,
      main: __dirname + `/${outDir}/index.d.ts`,
      out: path.resolve(__dirname, `${outDir}/index.d.ts`),
      removeSource: true,
      outputAsModuleFolder: true,
      verbose: false
    })
  })
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    index: path.resolve(__dirname, 'src/index.ts')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, outDir),
    library: 'Klouds',
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
  plugins: [new ATL.CheckerPlugin(), new DtsBundlePlugin()],
  devServer: {
    contentBase: [
      path.resolve(__dirname, 'public'),
      path.resolve(__dirname, 'lib')
    ],
    compress: true,
    port: 3337,
    inline: false,
    open: true,
    watchContentBase: true
  }
}
