module.exports = function (grunt, options) {
  return {
    deploy: {
      options: {
        patterns: [{
          match: /(?:"version"\:|Airlock) (?:"|v)(\d+\.\d+\.\d+)"?/,
          replacement: function (match, version, index, file) {
            var newVers = grunt.option('vn');
            if (!newVers) { return match; }
            grunt.config.set('pkg.version', newVers);
            return match.replace(version, newVers);
          }
        }]
      },
      files: [
        {
          src : ['package.json', 'bower.json', 'airlock.js'],
          dest : "./"
        }
      ]
    }
  };
};
