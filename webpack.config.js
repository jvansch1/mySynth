module.exports = {
    entry: "./lib/main.js",
    output: {
        path: __dirname,
        filename: "./lib/my_synth.js"
    },
    module: {
      loaders: [
        {
          loader: 'babel-loader'
        }
      ]
    }
};
