var require = patchRequire(require);

var serializeGaUrl = function (url) {
  var search = url.substring(40);
  search = decodeURIComponent(search).replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g,'":"');

  return JSON.parse('{"' + search + '"}');
};

var actionTest = function (name, tests) {
  var actionTestSet = [];

  casper.on('resource.requested', function (data) {
    if (!data.url.match(/google-analytics\.com\/collect/)) { return; }
    actionTestSet.push(serializeGaUrl(data.url));
  });

  var testNo = tests.reduce(function (prev, current) {
    return prev + Object.keys(current.expect).length;
  }, 0) + 1;

  casper.test.begin(name, testNo, function (casperTest) {
    casper.start('http://localhost:' + casper.cli.get('port'), function () {
      tests.forEach(function (test) {
        if (typeof test.when === 'function') {
          casper.evaluate(test.when);
          return;
        }
        casper.evaluate(function (args) {
          // HACK: this fixes a TERRIBLE CasperJS bug whereby `evaluate()`
          //       coerces single element arrays into strings. WHY.
          args = typeof args === 'string' ? [args] : args;
          _gaq.push(args);
        }, test.when);
      });
    });

    casper.run(function () {
      casperTest.assertEqual(actionTestSet.length, tests.length);
      tests.forEach(function (test, i) {
        for (var key in test.expect) {
          casperTest.assertEqual(actionTestSet[i][key], test.expect[key]);
        }
      });
      casperTest.done();
    });
  });
};

