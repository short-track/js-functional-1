import { log, go, curry } from './../common.js'

// 아래 코드는 사실 2d-training.js와 동일하다.
// 강사가 디버깅을 더 쉽게 찍기위해 코드를 수정한 것이다.
// 마찬가지로 나도 이 실험에서는
// 함수의 호출 순서를 더 정확하게 확인하고, 기록하고자 한다.

// 특히 각 함수들에서
// cur = iter.next() 로 표현해줬다. 강사는 실제로 내부적으로는 인자로 넘어온 iter의 next()를 호출하면서
// 순회가 시작되는 걸 보여주고 싶었던 것이다!

const L = {};
L.range = function* (l) {
    let i = -1;
    while (++i < l) {
        console.log('range')
        yield i;
    }
};

L.map = curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
        const a = cur.value;
        console.log('map')
        yield f(a);
    }
});

L.filter = curry(function* (f, iter) {
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
        const a = cur.value;
        console.log('filter')
        if (f(a)) {
            yield a;
        }
    }
});

const take = curry((l, iter) => {
    let res = [];
    iter = iter[Symbol.iterator]();
    let cur;
    while (!(cur = iter.next()).done) {
        console.log('take')
        const a = cur.value;
        res.push(a);
        if (res.length == l) return res;
    }
    return res;
});


console.time('L');
go(L.range(10000),
  L.map(n => n + 10),
  L.filter(n => n % 2),
  take(2),
  log);
console.timeEnd('L');


/*
콘솔 찍히는 순서
range
map
filter
range
map
filter
take
range
map
filter
range
map
filter
take

*/
