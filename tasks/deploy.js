module.exports = function (grunt) {
  grunt.registerTask('deploy', [
    'testOnce',
    'jshint:deploy',
    'replace:deploy',
    'uglify:deploy'
  ]);
};
