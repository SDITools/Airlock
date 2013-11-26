actionTest('Social', [{
  when: ['_trackSocial', 'socialNetwork', 'socialAction'],
  expect: { t: 'social', sn: 'socialNetwork', sa: 'socialAction' }
}, {
  when: ['_trackSocial', 'socialNetwork', 'socialAction', 'socialTarget'],
  expect: { t: 'social', sn: 'socialNetwork', sa: 'socialAction', st: 'socialTarget' }
}, {
  when: ['_trackSocial', 'socialNetwork', 'socialAction', 'socialTarget', 'pathname'],
  expect: { t: 'social', sn: 'socialNetwork', sa: 'socialAction', st: 'socialTarget', dp: 'pathname' }
}]);
