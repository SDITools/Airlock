module.exports = function (grunt) {
  grunt.loadTasks('tasks');

  require('load-grunt-tasks')(grunt);
  require('load-grunt-config')(grunt, {
    configPath: process.cwd() + '/tasks/options',
    autoInit: true,
    config: {
      pkg: grunt.file.readJSON('package.json'),
      env: process.env
    }
  });
};
