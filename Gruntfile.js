module.exports = function (grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    watch: {
      test: {
        files: ['airlock.js', 'tests/actions/*.js', 'tests/actionTester.js'],
        tasks: ['casperjs']
      }
    },
    casperjs: {
      options: {
        casperjsOptions: [
          '--concise',
          '--port=' + pkg.config.testPort,
          '--includes=tests/actionTester.js'
        ]
      },
      files: ['tests/actions/']
    },
    replace: {
      deploy: {
        options: {
          patterns: [{
            match: /(?:"version"\:|Airlock) (?:"|v)(\d+\.\d+\.\d+)"?/,
            replacement: function (match, version, index, file) {
              var newVers = grunt.option('vn');
              if (!newVers) { return match; }
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
    },
    uglify: {
      deploy: {
        options: {
          banner: '/* | <%= pkg.name %> - v<%= pkg.version %>' + '\n' +
                  '   | <%= pkg.homepage %> */' + '\n'
        },
        files: {
          'airlock.min.js': ['airlock.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-casperjs');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['server', 'casperjs', 'watch:test']);
  grunt.registerTask('testOnce', ['server', 'casperjs']);
  grunt.registerTask('deploy', ['replace:deploy', 'uglify:deploy']);

  grunt.registerTask('server', 'Server HTML test runner', function () {
    var fs = require('fs');
    var http = require('http');

    var WebServer = function (file) {
      var server = function(req, res) {
        var html = __dirname + '/tests/runner.html',
            js = __dirname + '/airlock.js',
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
    server.listen(pkg.config.testPort);
  });
};
