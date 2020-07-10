const withImages = require('next-images');

module.exports = withImages({
  inlineImageLimit: 10000,
  webpack: (config) => {
    config.devServer = config.devServer || {};
    config.devServer.host = '0.0.0.0';
    return config;
  },
});
