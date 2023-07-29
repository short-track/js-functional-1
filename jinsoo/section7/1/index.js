const { curry, map, filter, reduce, go, pipe, range, take } = require('./fx');
const log = console.log;

//* 결과를 만드는 함수 reduce, take
//* map이나 filter 같은 함수는 지연성 프로그래밍이 가능하다.
//* 물론 take도 지연성을 가지도록 짤 수 있지만, 바로 결과를 만드는게 이점이 더 많은 함수다.

//* reduce
const L = {};

L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

L.map = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    yield f(a);
  }
});

L.filter = curry(function* (f, iter) {
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    if (f(a)) {
      yield a;
    }
  }
});

const join = curry((sep = ',', iter) =>
  reduce((a, b) => `${a}${sep}${b}`, iter)
);

const queryStr = pipe(
  L.entries,
  L.map(([k, v]) => `${k}=${v}`),
  join('&')
);
log(queryStr({ limit: 10, offset: 10, type: 'notice' }));

console.clear();

//* take, find
const users = [
  { age: 32 },
  { age: 31 },
  { age: 37 },
  { age: 28 },
  { age: 25 },
  { age: 32 },
  { age: 31 },
  { age: 37 },
];

const find = curry((f, iter) => go(iter, L.filter(f), take(1), ([a]) => a));

log(find((u) => u.age < 30)(users));

go(
  users,
  L.map((u) => u.age),
  find((n) => n < 30),
  log
);
