actionTest('Pageviews', [{
  when: ['_trackPageview'],
  expect: { t: 'pageview' }
}, {
  when: ['_trackPageview', '/virtual/pageview'],
  expect: { t: 'pageview', dp: '/virtual/pageview' }
}]);
