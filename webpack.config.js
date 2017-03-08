module.exports = {
    entry: "./lib/main.js",
    output: {
        path: __dirname,
        filename: "./lib/my_synth.js",
    },
    module: {
    loaders: [
      {
        test: [/\.js?$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '*']
  },
};
