const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'build'),
    library: 'LaTeXTranspiler',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  // devtool:"source-map"
};
