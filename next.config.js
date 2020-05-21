module.exports = {
  webpack: config => {
    config.devServer = config.devServer || {};
    config.devServer.host = '0.0.0.0';
    return config;
  },
};
