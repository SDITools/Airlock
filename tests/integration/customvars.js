actionTest('Custom Vars', [{
  when: function() {
    _gaq.push(['_setCustomVar', 1, 'name', 'value']);
    _gaq.push(['_trackPageview']);
  },
  expect: { t: 'pageview' , cd1: 'value'}
}]);
