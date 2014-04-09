module.exports = {
  // 'tests-unit': {
  //   files: ['airlock.js', 'tests/unit/*.js'],
  //   tasks: ['casperjs:unit']
  // },
  'tests-integration': {
    files: ['airlock.js', 'tests/integration/*.js', 'tests/helpers/integration.js'],
    tasks: ['test:integration']
  }
};
