module.exports = function (grunt) {
  grunt.registerTask('server', 'Server HTML test runner', function () {
    var fs = require('fs');
    var http = require('http');
    var port = grunt.config.get('pkg.config.testPort');
    var cwd = process.cwd();

    var WebServer = function (file) {
      var server = function(req, res) {
        var html = cwd + '/tests/runner.html',
            js = cwd + '/airlock.js',
            file;

        if (req.url === '/') { file = html; }
        if (/\.js$/.test(req.url)) { file = js; }
        if (!file) { return; }

        fs.readFile(file, function (err, data) {
          if (err) {
            res.writeHead(500);
            return res.end('Error loading ' + file);
          }
          res.writeHead(200);
          res.end(data);
        });
      };
      return http.createServer(server);
    };

    var server = new WebServer();
    server.listen(port);
  });
};
