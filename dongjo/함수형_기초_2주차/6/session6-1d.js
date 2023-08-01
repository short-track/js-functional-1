import { map, reduce, go, pipe, curry, filter } from './../common.js'
const log = console.log;
// ## range

var add = (a, b) => a + b;

const range = l => {
    let i = -1;
    let res = [];
    while (++i < l) {
        res.push(i);
    }
    return res;
};

var list = range(4);
log(list);
log(reduce(add, list));


// ## 느긋한 L.range

const L = {};
L.range = function* (l) {
    let i = -1;
    while (++i < l) {
        yield i;
    }
};

var list = L.range(4);
log(list);
log(reduce(add, list));


function test(name, time, f) {
    console.time(name);
    while (time--) f();
    console.timeEnd(name);
}

// test('range', 10, () => reduce(add, range(1000000)));
// test('L.range', 10, () => reduce(add, L.range(1000000)));
console.clear();


// ## take

const take = curry((l, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length == l) return res;
    }
    return res;
});
console.time('');

go(
    range(10000),
    take(5),
    reduce(add),
    log);
console.timeEnd('');

console.time('');
go(
    L.range(10000),
    take(5),
    reduce(add),
    log);
console.timeEnd('');


// # 이터러블 중심 프로그래밍에서의 지연 평가 (Lazy Evaluation)
// - 제때 계산법
// - 느긋한 계산법
// - 제너레이터/이터레이터 프로토콜을 기반으로 구현

// ### L.map

L.map = function *(f, iter) {
    for (const a of iter) yield f(a);
};
var it = L.map(a => a + 10, [1, 2, 3]);
log(it.next());
log(it.next());
log(it.next());

// ### L.filter

L.filter = function *(f, iter) {
    for (const a of iter) if (f(a)) yield a;
};
var it = L.filter(a => a % 2, [1, 2, 3, 4]);
log(it.next());
log(it.next());
log(it.next());