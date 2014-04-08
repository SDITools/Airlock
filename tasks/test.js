module.exports = function (grunt) {
  grunt.registerTask('test', ['server', 'casperjs', 'watch:test']);
};
