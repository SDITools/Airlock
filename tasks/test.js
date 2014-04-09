module.exports = function (grunt) {
  grunt.registerMultiTask('test', 'Run Airlock tests', function () {
    var options = this.options({
          helpers: []
        }),
        optsKey = 'casperjs.options.casperjsOptions';

    grunt.config('casperjs.files', options.tests);
    grunt.config(optsKey, grunt.config.get(optsKey).concat('--includes=' + options.helpers.join()));
    grunt.task.run(['server', 'casperjs']);
  });
};
