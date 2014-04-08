module.exports = function (grunt, options) {
  return {
    newVersion: {
      options: {
        tag: 'v' + grunt.option('vn'),
        message: 'Updating Version'
      }
    }
  };
};
