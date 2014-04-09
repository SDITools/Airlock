actionTest('Events', [{
  when: ['_trackEvent', 'eventCategory', 'eventAction'],
  expect: { t: 'event', ec: 'eventCategory', ea: 'eventAction' }
}, {
  when: ['_trackEvent', 'eventCategory', 'eventAction', 'anything'],
  expect: { t: 'event', ec: 'eventCategory', ea: 'eventAction', el: 'anything' }
}, {
  when: ['_trackEvent', 'eventCategory', 'eventAction', 'eventLabel', 'eventValue'],
  expect: { t: 'event', ec: 'eventCategory', ea: 'eventAction', el: 'eventLabel', ev: 'eventValue' }
}, {
  when: ['_trackEvent', 'eventCategory', 'eventAction', 'eventLabel', 'eventValue', 1],
  expect: { t: 'event', ec: 'eventCategory', ea: 'eventAction', el: 'eventLabel', ev: 'eventValue', ni: "1" }
}]);
