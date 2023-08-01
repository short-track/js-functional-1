import { log, reduce, curry } from './../common.js'

const L = {};
// Object.entries를 활용 [[key, value], [key, value], [key, value]] 형태로 만들어준다.
L.entries = function* (obj) {
    for (const k in obj) yield [k, obj[k]];
};

// reduce를 활용
const join = curry((sep = ',', iter) =>
    reduce((a, b) => `${a}${sep}${b}`, iter));


// entries + map + join 을 활용한 queryString 만들기
const queryString = pipe(
    L.entries,
    L.map(([k, v]) => `${k}=${v}`),
    join('&'));

log(queryString({limit: 10, offset: 10, type: 'notice'}));
