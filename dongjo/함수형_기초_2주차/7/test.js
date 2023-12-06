import { log, reduce, pipe, map } from './../common.js'
const scores = [
  {name: '초롱이', kor: 60, math: 63, eng: 87},
  {name: '빡빡이', kor: 40, math: 72, eng: 82},
  {name: '마동석', kor: 70, math: 38, eng: 41},
  {name: '리키', kor: 90, math: 96, eng: 56},
  {name: '백바지', kor: 85, math: 53, eng: 78}
];

const getAverage = (numbers) => pipe (
  reduce((a, b) => a + b),
  sum => sum / numbers.length
)(numbers);

log(getAverage([10, 20, 30]))