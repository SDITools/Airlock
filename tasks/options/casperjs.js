module.exports = function (grunt, options) {
  return {
    options: {
      casperjsOptions: [
        '--concise',
        '--port=' + options.package.config.testPort
      ]
    }
  };
};
