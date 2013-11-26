actionTest('Timing', [{
  when: ['_trackTiming', 'category', 'variable', 'time'],
  expect: { t: 'timing', utc: 'category', utv: 'variable', utt: 'time' }
}, {
  when: ['_trackTiming', 'category', 'variable', 'time', 'opt_label'],
  expect: { t: 'timing', utc: 'category', utv: 'variable', utt: 'time' , utl: 'opt_label'}
}, {
  when: ['_trackTiming', 'category', 'variable', 'time', 'opt_label', 'opt_samplerate'],
  expect: { t: 'timing', utc: 'category', utv: 'variable', utt: 'time' , utl: 'opt_label'}
}]);
