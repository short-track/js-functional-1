import { map, reduce, go, pipe, curry, filter } from '../common.js'
const log = console.log;

/*
    지연평가, Lazy Evaluation

    - 필요할 때만 평가한다.
    - 무한한 리스트를 다룰 수 있다. (무한 리스트라도 필요한 만큼만 평가한다.)
    - 성능이 좋다.

*/

const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
        res.push(i);
    }
    return res;
};
const L = {};
L.range = function* (l) {
    let i = -1;
    while (++i < l) {
        yield i;
    }
};

// 성능이 좋다
// - 왜? 프로세스의 동시성?
function test(name, time, f) {
    console.time(name);
    while (time--) f();
    console.timeEnd(name);
}
const add = (a, b) => a + b;
// 내부적으로 100000번 돈다.
test('range', 10, () => reduce(add, range(1000000)));
// 내부적으로 10번 돈다.
test('L.range', 10, () => reduce(add, L.range(1000000)));

console.log('------------------');
console.log(reduce(add, range(1000000)));
console.log(reduce(add, L.range(1000000)));


// 무한한 리스트를 다룰 수 있다.
// take 같은 함수를 적용했을 시
const take = curry((l, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length == l) return res;
    }
    return res;
});

function* infinity(i = 0) {
    while(true) yield i++;
}
go(
    infinity(1),
    take(5),
    reduce(add),
    log);


// ### L.map 으로 적용했을 시



