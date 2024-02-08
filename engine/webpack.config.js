const { resolve } = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  context: resolve(__dirname, 'src'),
  entry: {
    lib: './index.ts',
  },
  mode: 'production',
  output: {
    path: resolve(__dirname, 'dist'),
    clean: true,
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [],
}
