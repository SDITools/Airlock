module.exports = function (grunt, options) {
  return {
    options: {
      casperjsOptions: [
        '--concise',
        '--port=' + options.pkg.config.testPort,
        '--includes=tests/actionTester.js'
      ]
    },
    files: ['tests/actions/']
  };
};
