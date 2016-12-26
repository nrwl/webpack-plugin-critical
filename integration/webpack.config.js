const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;
const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new CriticalPlugin({
      src: 'index.html',
      base: path.resolve(__dirname),
      inline: true,
      minify: true,
      dest: 'index.html'
    })
  ]
};
