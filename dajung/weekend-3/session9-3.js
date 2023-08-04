// 지연된 함수를 병렬적으로 수행하기
const { go, L, reduce } = require('../lib')

const delay1000 = a => new Promise(resolve => setTimeout(() => resolve(a), 1000))
const add = (a, b) => a + b;

go(
    [1, 2, 3, 4, 5],
    L.map(a => delay1000(a * a)),
    L.filter(a => a % 2),
    reduce(add),
    console.log
)