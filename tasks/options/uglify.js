module.exports = {
  deploy: {
    options: {
      report: 'gzip',
      banner: '/* | <%= pkg.name %> - v<%= pkg.version %>' + '\n' +
              '   | <%= pkg.homepage %> */' + '\n'
    },
    files: {
      'airlock.min.js': ['airlock.js']
    }
  }
};
