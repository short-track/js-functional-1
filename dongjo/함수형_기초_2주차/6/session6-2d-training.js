import { log, go, curry } from './../common.js'

// 세션 6에서는 한결같이 지연성에 대한 강점을 설명하고 있다.
// - 영리하다는 것 : 필요한 시점에 계산을 한다.
// - 효율적이라는 것
// - 무한한 것을 다룰 수 있는 것

// 그런데 여기서 2번째 핵심은 이 지연성을 표현하는 함수는 3가지로 소개된다
// - L.range
// - L.map
// - L.filter

// 즉, 이터레이터를 순회하는 로직을 가진 함수를 통해 지연성을 표현한다는 것이다.
// reduce, take, go, pipe 등은 이터레이터를 순회하는 로직 보다는 어느 순간 순회를 깨거나, 결과값을 도출하는 로직이기 때문이다.

const L = {};
// range는 인자가 1개라서 curry를 적용할 수 없다.
L.range = function* (l) {
    let i = -1;
    while (++i < l) {
        console.log('range')
        yield i;
    }
};

L.map = curry(function *(f, iter) {
    for (const a of iter) {
        console.log('map')
        yield f(a);
    }
});

L.filter = curry(function *(f, iter) {
    for (const a of iter) {
        if (f(a)) {
            yield a;
        }
    }
});

const take = curry((l, iter) => {
    let res = [];
    for (const a of iter) {
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
