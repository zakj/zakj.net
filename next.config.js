const withStylus = require("@zeit/next-stylus");

module.exports = withStylus({
  cssModules: true,
  cssLoaderOptions: {
    localIdentName: "[local]-[hash:base64:5]",
  },
});
