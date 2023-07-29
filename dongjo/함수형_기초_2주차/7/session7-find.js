import { log, reduce, curry } from './../common.js'

const users = [
    {age: 32},
    {age: 31},
    {age: 37},
    {age: 28},
    {age: 25},
    {age: 32},
    {age: 31},
    {age: 37}
];

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

// L.filter + take를 조합해서 find 만들기
const find = curry((f, iter) => go(
    iter,
    L.filter(f),
    take(1),
    ([a]) => a));

log(find(u => u.age < 30)(users));
